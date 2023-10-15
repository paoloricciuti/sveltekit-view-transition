import { afterNavigate, onNavigate } from '$app/navigation';
import type { OnNavigate } from '@sveltejs/kit';
import { SetOfCallback } from './utils';
import { onDestroy } from 'svelte';
import { browser } from '$app/environment';

export type TransitionActionFunctionProps<TEvent extends keyof SveltekitViewTransitionEventsMap> =
	SveltekitViewTransitionEventsMap[TEvent] & {
		node: HTMLElement | SVGElement;
		isInViewport: boolean;
	};

export type TransitionAction = {
	name: string | ((props: TransitionActionFunctionProps<'before-start-view-transition'>) => string);
	classes?:
		| string[]
		| ((
				props: TransitionActionFunctionProps<'before-start-view-transition'>,
		  ) => string[] | undefined);
	shouldApply?:
		| boolean
		| ((props: TransitionActionFunctionProps<'before-start-view-transition'>) => boolean);
	applyImmediately?:
		| boolean
		| ((props: TransitionActionFunctionProps<'after-navigation-complete'>) => boolean);
};

export type TransitionActionFunctions = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	[Key in keyof TransitionAction]-?: Extract<TransitionAction[Key], Function>;
};

export type OnOptions = {
	registerDuringTransition?: boolean;
	autoWrap?: boolean;
	autoClean?: boolean;
};

interface ViewTransition {
	updateCallbackDone: Promise<void>;
	ready: Promise<void>;
	finished: Promise<void>;
	skipTransition: () => void;
}

export type SveltekitViewTransitionEventsMap = {
	'before-start-view-transition': {
		navigation: OnNavigate;
	};
	'before-navigation': {
		navigation: OnNavigate;
	};
	'before-navigation-complete': {
		navigation: OnNavigate;
	};
	'after-navigation-complete': {
		navigation: OnNavigate;
	};
	'transition-ready': {
		navigation: OnNavigate;
		transition: ViewTransition;
	};
	'update-callback-done': {
		navigation: OnNavigate;
		transition: ViewTransition;
	};
	'transition-finished': {
		navigation: OnNavigate;
		transition: ViewTransition;
	};
};

export type SveltekitViewTransitionEvents = keyof SveltekitViewTransitionEventsMap;

type ListenerMap = {
	[Key in SveltekitViewTransitionEvents]?: Set<{
		listener: (props: SveltekitViewTransitionEventsMap[Key]) => void;
		auto_clean: boolean;
	}>;
};

const callbacks: ListenerMap = {};

let on_navigate_registered = 0;

let is_transition_happening = false;

const listeners_during_transition_queue = new Set<() => void>();

function run_all_events<T extends SveltekitViewTransitionEvents>(
	event: T,
	props: SveltekitViewTransitionEventsMap[T],
) {
	const events = callbacks[event];
	if (events) {
		events.forEach((callback) => {
			try {
				callback.listener(props);
			} catch (e) {
				console.error(`Error in callback for event "${event}": ${e}`);
			}
			if (callback.auto_clean) {
				events.delete(callback);
			}
		});
	}
}

function off<T extends SveltekitViewTransitionEvents>(
	event: T,
	callback: (props: SveltekitViewTransitionEventsMap[T]) => void | Promise<void>,
	autoWrap = true,
) {
	function off_function() {
		let events = callbacks[event];
		if (!events) {
			callbacks[event] = new SetOfCallback<SveltekitViewTransitionEventsMap[T]>() as ListenerMap[T];
			events = callbacks[event];
		}
		// loop over the listeners to search for the one with the right callback
		for (const event of events?.values() ?? []) {
			if (event.listener === callback) {
				// when found it delete the event and break from the loop
				events?.delete(event);
				break;
			}
		}
	}
	// if we need to avoid wrapping we just call the function
	if (!autoWrap) {
		off_function();
	} else {
		// this can fail if caled inside another afterNavigate so we fallback to just call the off function
		try {
			afterNavigate(() => {
				off_function();
			});
		} catch (e) {
			console.warn(
				'I tried to wrap the function within afterNavigate and failed...are you calling this inside afterNavigate?',
			);
			off_function();
		}
	}
}

function on<T extends SveltekitViewTransitionEvents>(
	event: T,
	callback: (props: SveltekitViewTransitionEventsMap[T]) => void,
	{ registerDuringTransition = false, autoWrap = true, autoClean = true }: OnOptions = {},
) {
	const return_value = (wrap = autoWrap) => off(event, callback, wrap);
	function on_function() {
		function register_listener() {
			let events = callbacks[event];
			if (!events) {
				callbacks[event] = new SetOfCallback<
					SveltekitViewTransitionEventsMap[T]
				>() as ListenerMap[T];
				events = callbacks[event];
			}
			events?.add({ listener: callback, auto_clean: autoClean });
		}
		// if there's a transition happening we store a function to add the listener
		// in the queue and return the un-subscriber
		if (is_transition_happening && !registerDuringTransition) {
			listeners_during_transition_queue.add(() => {
				register_listener();
			});
			return return_value;
		}
		register_listener();
	}
	if (!autoWrap) {
		on_function();
		return return_value;
	}
	try {
		afterNavigate(() => {
			on_function();
		});
	} catch (e) {
		console.warn(
			'I tried to wrap the function within afterNavigate and failed...are you calling this inside afterNavigate?',
		);
		on_function();
	}
	return return_value;
}

function classes(
	to_add:
		| string[]
		| ((
				props: SveltekitViewTransitionEventsMap['before-start-view-transition'],
		  ) => string[] | undefined),
	autoWrap = true,
) {
	let classes: string[] | undefined;
	const off_finished = on(
		'transition-finished',
		() => {
			if (classes && classes.length > 0) {
				document.documentElement.classList.remove(...classes);
			}
		},
		{
			registerDuringTransition: false,
			autoWrap,
		},
	);
	on(
		'before-start-view-transition',
		(navigation) => {
			classes = Array.isArray(to_add) ? to_add : to_add(navigation);
			if (classes) {
				document.documentElement.classList.add(...classes);
			} else {
				off_finished(true);
			}
		},
		{
			registerDuringTransition: false,
			autoWrap,
		},
	);
}

function transition(node: HTMLElement | SVGElement, props: string | TransitionAction) {
	if (typeof props === 'string') {
		node.style.setProperty('view-transition-name', props);
		return;
	}
	function setup_listeners_for_props(props: TransitionAction) {
		let classes_to_add: string[] | undefined;
		const off_functions: ReturnType<typeof on>[] = [];
		off_functions.push(
			on(
				'after-navigation-complete',
				(callback_props) => {
					const { top } = node.getBoundingClientRect();
					const is_in_viewport = top < window.innerHeight + window.scrollY;
					const props_for_callback = { ...callback_props, node, isInViewport: is_in_viewport };
					let apply_immediately = false;
					if (props.applyImmediately != null) {
						apply_immediately =
							typeof props.applyImmediately === 'boolean'
								? props.applyImmediately
								: props.applyImmediately(props_for_callback);
					}
					if (apply_immediately) {
						const name =
							typeof props.name === 'function' ? props.name(props_for_callback) : props.name;
						node.style.setProperty('view-transition-name', name);
						off_functions.push(
							on(
								'transition-finished',
								() => {
									node.style.setProperty('view-transition-name', null);
								},
								{ registerDuringTransition: true, autoWrap: false, autoClean: false },
							),
						);
					}
				},
				{ registerDuringTransition: true, autoWrap: false, autoClean: false },
			),
		);
		const off_before = on(
			'before-start-view-transition',
			(callback_props) => {
				let should_apply = true;
				const { top } = node.getBoundingClientRect();
				const is_in_viewport = top < window.innerHeight + window.scrollY;
				const props_for_callback = { ...callback_props, node, isInViewport: is_in_viewport };
				if (props.shouldApply != null) {
					should_apply =
						typeof props.shouldApply === 'boolean'
							? props.shouldApply
							: props.shouldApply(props_for_callback);
				}
				if (should_apply) {
					const name =
						typeof props.name === 'function' ? props.name(props_for_callback) : props.name;
					node.style.setProperty('view-transition-name', name);
					off_functions.push(
						on(
							'transition-finished',
							() => {
								node.style.setProperty('view-transition-name', null);
							},
							{
								autoWrap: false,
								registerDuringTransition: true,
								autoClean: false,
							},
						),
					);
					if (props.classes) {
						classes_to_add = Array.isArray(props.classes)
							? props.classes
							: props.classes(props_for_callback);
					}
					if (classes_to_add) {
						document.documentElement.classList.add(...classes_to_add);
					} else {
						off_finished?.();
					}
				}
			},
			{ registerDuringTransition: false, autoWrap: false, autoClean: false },
		);
		off_functions.push(off_before);
		let off_finished: ReturnType<typeof on> | undefined = undefined;
		off_finished = on(
			'transition-finished',
			() => {
				if (classes_to_add && classes_to_add.length > 0) {
					document.documentElement.classList.remove(...classes_to_add);
				}
			},
			{ registerDuringTransition: false, autoWrap: false, autoClean: false },
		);
		off_functions.push(off_finished);
		return () => {
			off_functions.forEach((off) => {
				off(false);
			});
		};
	}
	let cleanup: ReturnType<typeof setup_listeners_for_props> | undefined =
		setup_listeners_for_props(props);
	return {
		update(new_props: string | TransitionAction) {
			// on update remove the previous listeners
			cleanup?.();
			cleanup = undefined;
			// if it's a string just set the view transition name
			if (typeof new_props === 'string') {
				node.style.setProperty('view-transition-name', new_props);
				return;
			}
			// otherwise run the setup listeners function and store the new cleanup
			cleanup = setup_listeners_for_props(new_props);
		},
		destroy() {
			// clean everything
			cleanup?.();
		},
	};
}

export function setupViewTransition() {
	// only register once the onNavigate
	if (on_navigate_registered === 0 && browser && document.startViewTransition) {
		on_navigate_registered++;
		onNavigate((navigation) => {
			// this should never happen but better be safe than sorry
			if (!document.startViewTransition) return;
			return new Promise((resolve) => {
				run_all_events('before-start-view-transition', { navigation });
				const transition = document.startViewTransition(async () => {
					is_transition_happening = true;
					run_all_events('before-navigation', { navigation });
					resolve();
					run_all_events('before-navigation-complete', { navigation });
					// reset back the on_navigate_registered to register on the new route
					await navigation.complete;
					run_all_events('after-navigation-complete', { navigation });
				});
				transition.ready
					.then(() => {
						run_all_events('transition-ready', { navigation, transition });
					})
					.catch(console.error);
				transition.updateCallbackDone
					.then(() => {
						run_all_events('update-callback-done', { navigation, transition });
					})
					.catch(console.error);
				transition.finished
					.then(() => {
						run_all_events('transition-finished', { navigation, transition });
						is_transition_happening = false;
						listeners_during_transition_queue.forEach((add_listener) => {
							add_listener();
						});
						listeners_during_transition_queue.clear();
					})
					.catch(console.error);
			});
		});

		onDestroy(() => {
			on_navigate_registered--;
		});
	}

	return {
		/**
		 * Function used to register a callback run during the onNavigate
		 * @param event the event name you want to register a callback for
		 * @param callback The callback you want to run
		 * @param options The options for the add listener
		 * @param options.registerDuringTransition if you want to register this callback even if a transition is running (if false
		 * it will still be registered as soon as the transition finishes)
		 * @param options.avoidWrapping by default the on function is wrapped in afterNavigate so that you can
		 * avoid unnecessarily wrap it every time. If you need to avoid this behavior you can pass true.
		 * @param options.autoClean wether the listener clean automatically after has been applied or it requires manual cleaning.
		 * it defaults to true
		 * @returns A function to deregister the callback
		 */
		on,
		/**
		 * This function is used to deregister from an event. A function that
		 * deregister from an event is also returned from the on function.
		 * @param event the event name you want to deregister from
		 * @param callback the callback reference you want to deregister
		 * @param autoWrap by default the off function is wrapped in afterNavigate so that you can
		 * avoid unnecessarily wrap it every time. If you need to avoid this behavior you can pass false.
		 */
		off,
		/**
		 * The action to specify a transition name on a specific element. You can use it on an element
		 * passing a string to directly assign that specific string as view transition name.
		 *
		 * If you pass an object instead you can specify a series of options:
		 *
		 * - name: required, it's the transition name that will be applied it can be either a string or a function that return a string. The function takes a navigation
		 * object as input. This is useful if you need to apply different transition names depending on where the navigation is going.
		 * - classes: either an array of strings or a function that returns an array of string that will be applied
		 * during the transition. The function will take a navigation object
		 * - applyImmediately: by default when you specify a transition name it will only be applied when it's actually navigating
		 * following the suggestion from Jake Archibald himself (the creator of the view transition api) https://twitter.com/jaffathecake/status/1697541871847748098?s=20
		 * that you should not add transition names to everything but only to the elements involved in the transition. Sometimes tho you want to
		 * add a transition name immediately (for example when you are coming back from a detail page and you want to animate back an image in the list).
		 * applyImmediately is either a boolean or a function that take the navigation object (please note that this is the navigation object) from
		 * the previous page so the `from` will be the page that is navigating to this page and the `to` will be this page) and returns a boolean.
		 * - shouldApply: as mentioned above this can be either a boolean or a function that takes a navigation object (this time the `from` is
		 * this page and the `to` is the page you are navigating to) and return a boolean. If the boolean is true the transition name will be applied.
		 * This is useful when you want to navigate from a list to a detail.
		 *
		 * @param node The element to apply the action to
		 * @param props either a string for a simple view transition name or a set of options
		 */
		transition,
		/**
		 * Function to call during component initialization to add a class or a series of classes
		 * during the navigation. This is useful to run a different types of transition when you are going
		 * back to a specific page.
		 *
		 * The classes will be automatically removed at the end of the transition.
		 *
		 * @param to_add either a list of class that will always be applied or a function that returns an array
		 * of strings. The function will get a navigation props as input to allow you to check the to, from, route id etc.
		 * @param autoWrap by default the classes function is wrapped in afterNavigate so that you can
		 * avoid unnecessarily wrap it every time. If you need to avoid this behavior you can pass false.
		 */
		classes,
	};
}
