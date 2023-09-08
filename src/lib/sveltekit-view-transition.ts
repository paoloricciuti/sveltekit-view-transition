import { onNavigate } from '$app/navigation';
import type { OnNavigate } from '@sveltejs/kit';
import { SetOfCallback } from './utils';
import { onDestroy } from 'svelte';

export type TransitionAction = {
	name:
		| string
		| ((props: SveltekitViewTransitionEventsMap['before-start-view-transition']) => string);
	classes?:
		| string[]
		| ((
				props: SveltekitViewTransitionEventsMap['before-start-view-transition'],
		  ) => string[] | undefined);
	shouldApply?:
		| boolean
		| ((props: SveltekitViewTransitionEventsMap['before-start-view-transition']) => boolean);
	applyImmediately?:
		| boolean
		| ((props: SveltekitViewTransitionEventsMap['after-navigation-complete']) => boolean);
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
	[Key in SveltekitViewTransitionEvents]?: Set<
		(props: SveltekitViewTransitionEventsMap[Key]) => void
	>;
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
				callback(props);
			} catch (e) {
				console.error(`Error in callback for event "${event}": ${e}`);
			}
		});
		events.clear();
	}
}

/**
 * This function is used to deregister from an event. A function that
 * deregister from an event is also returned from the on function.
 * @param event the event name you want to deregister from
 * @param callback the callback reference you want to deregister
 */
function off<T extends SveltekitViewTransitionEvents>(
	event: T,
	callback: (props: SveltekitViewTransitionEventsMap[T]) => void | Promise<void>,
) {
	let events = callbacks[event];
	if (!events) {
		callbacks[event] = new SetOfCallback<SveltekitViewTransitionEventsMap[T]>() as ListenerMap[T];
		events = callbacks[event];
	}
	events?.delete(callback);
}

/**
 * Function used to register a callback run during the onNavigate
 * @param event the event name you want to register a callback for
 * @param callback The callback you want to run
 * @param registerDuringTransition if you want to register this callback even if a transition is running (if false
 * it will still be registered as soon as the transition finishes)
 * @returns A function to deregister the callback
 */
function on<T extends SveltekitViewTransitionEvents>(
	event: T,
	callback: (props: SveltekitViewTransitionEventsMap[T]) => void,
	registerDuringTransition = false,
) {
	const return_value = () => off(event, callback);
	// if there's a transition happening we store a function to add the listener
	// in the queue and return the un-subscriber
	if (is_transition_happening && !registerDuringTransition) {
		listeners_during_transition_queue.add(() => {
			on(event, callback);
		});
		return return_value;
	}
	let events = callbacks[event];
	if (!events) {
		callbacks[event] = new SetOfCallback<SveltekitViewTransitionEventsMap[T]>() as ListenerMap[T];
		events = callbacks[event];
	}
	events?.add(callback);
	return return_value;
}

/**
 * Function to call during component initialization to add a class or a series of classes
 * during the navigation. This is useful to run a different types of transition when you are going
 * back to a specific page.
 *
 * The classes will be automatically removed at the end of the transition.
 *
 * @param to_add either a list of class that will always be applied or a function that returns an array
 * of strings. The function will get a navigation props as input to allow you to check the to, from, route id etc.
 */
function classes(
	to_add:
		| string[]
		| ((
				props: SveltekitViewTransitionEventsMap['before-start-view-transition'],
		  ) => string[] | undefined),
) {
	let classes: string[] | undefined;
	const off_finished = on('transition-finished', () => {
		if (classes && classes.length > 0) {
			document.documentElement.classList.remove(...classes);
		}
	});
	on('before-start-view-transition', (navigation) => {
		classes = Array.isArray(to_add) ? to_add : to_add(navigation);
		if (classes) {
			document.documentElement.classList.add(...classes);
		} else {
			off_finished();
		}
	});
}

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
function transition(node: HTMLElement, props: string | TransitionAction) {
	if (typeof props === 'string') {
		node.style.setProperty('view-transition-name', props);
		return;
	}
	function setup_listeners_for_props(props: TransitionAction) {
		let classes_to_add: string[] | undefined;
		on(
			'after-navigation-complete',
			(callback_props) => {
				let apply_immediately = false;
				if (props.applyImmediately != null) {
					apply_immediately =
						typeof props.applyImmediately === 'boolean'
							? props.applyImmediately
							: props.applyImmediately(callback_props);
				}
				if (apply_immediately) {
					const name = typeof props.name === 'function' ? props.name(callback_props) : props.name;
					node.style.setProperty('view-transition-name', name);
					on(
						'transition-finished',
						() => {
							node.style.setProperty('view-transition-name', null);
						},
						true,
					);
				}
			},
			true,
		);
		const off_before = on('before-start-view-transition', (callback_props) => {
			let should_apply = true;
			if (props.shouldApply != null) {
				should_apply =
					typeof props.shouldApply === 'boolean'
						? props.shouldApply
						: props.shouldApply(callback_props);
			}
			if (should_apply) {
				const name = typeof props.name === 'function' ? props.name(callback_props) : props.name;
				node.style.setProperty('view-transition-name', name);
				if (props.classes) {
					classes_to_add = Array.isArray(props.classes)
						? props.classes
						: props.classes(callback_props);
				}
				if (classes_to_add) {
					document.documentElement.classList.add(...classes_to_add);
				} else {
					off_finished?.();
				}
			}
		});
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		let off_finished = () => {};
		off_finished = on('transition-finished', () => {
			if (classes_to_add && classes_to_add.length > 0) {
				document.documentElement.classList.remove(...classes_to_add);
			}
		});
		return () => {
			off_before();
			off_finished?.();
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
	if (on_navigate_registered === 0) {
		on_navigate_registered++;
		onNavigate((navigation) => {
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
					.catch(console.dir);
				transition.updateCallbackDone.then(() => {
					run_all_events('update-callback-done', { navigation, transition });
				});
				transition.finished.then(() => {
					run_all_events('transition-finished', { navigation, transition });
					is_transition_happening = false;
					listeners_during_transition_queue.forEach((add_listener) => {
						add_listener();
					});
					listeners_during_transition_queue.clear();
				});
			});
		});

		onDestroy(() => {
			on_navigate_registered--;
		});
	}

	return {
		on,
		off,
		transition,
		classes,
	};
}
