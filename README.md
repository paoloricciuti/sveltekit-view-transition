# sveltekit-view-transition

An abstraction on top of `view-transition-api` and `onNavigate` to allow for a seamless experience in SvelteKit.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

![npm bundle size](https://img.shields.io/bundlephobia/minzip/sveltekit-view-transition)

![npm](https://img.shields.io/npm/v/sveltekit-view-transition)

![npm](https://img.shields.io/npm/dt/sveltekit-view-transition)

![GitHub last commit](https://img.shields.io/github/last-commit/paoloricciuti/sveltekit-view-transition)

## Contributing

Contributions are always welcome!

For the moment there's no code of conduct neither a contributing guideline but if you found a problem or have an idea feel free to [open an issue](https://github.com/paoloricciuti/sveltekit-view-transition/issues/new)

If you want the fastest way to open a PR try out Codeflow

[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://pr.new/paoloricciuti/sveltekit-view-transition/)

## Authors

- [@paoloricciuti](https://www.github.com/paoloricciuti)

## Installation

Install sveltekit-view-transition with your package manager of choice

```bash
npm install sveltekit-view-transition@latest -D
```

```bash
yarn add sveltekit-view-transition@latest -D
```

```bash
pnpm install sveltekit-view-transition@latest -D
```

## Usage/Examples

The library propose itself to ease the common use cases for `view-transition-api`.

The most easy and immediate setup is importing and adding `setupViewTransition` in the root layout page. This will automatically enable the default transition at every navigation.

```svelte
<script>
	import { setupViewTransition } from 'sveltekit-view-transition';

	setupViewTransition();
</script>

<slot />
```

You can target and modify the default animation with `::view-transition-old(root)` and `::view-transition-new(root)`. However it's ofter useful to have specific part of the page have different view transitions. For example the header might be fixed and we would like to animate it differently. To allow for this use case `setupViewTransition` return an object from which you can destructure `transition`.

### transition

`transition` is an action that accept a string as input and assign that string as the `view-transition-name` of that element. Plain and simple.

```svelte
<script>
	import { setupViewTransition } from 'sveltekit-view-transition';

	const { transition } = setupViewTransition();
</script>

<header use:transition={'header'}>
	<!-- links -->
</header>
<slot />
```

This will allow you to target the header with `::view-transition-old(header)` and `::view-transition-new(header)`.

Now while this may seem enough sometimes you might want to be a bit more creative with the transition names and that's why instead of a string you can also pass an object to the transition action.

#### name

This is the name of the transition, much like the string that you would've passed before it's what will end up as the `view-transition-name`. It's the only required field.

#### classes

Either an array of strings or a function that returns an array of string that will be applied during the transition. This allows you to target specific classnames in your css. For example let's say that you are clicking on a back button and when going back on an old page you want to apply a different navigation, how would you do it? Simply pass the array `["back"]` and target the classes in your css `.back::view-transition-old(yourname)` and `.back::view-transition-new(yourname)`. The function will take a `OnNavigate` object as input which is the same object that sveltekit will pass to the `onNavigate` function. It looks like this

```ts
interface Navigation {
	/**
	 * Where navigation was triggered from
	 */
	from: {
		/**
		 * Parameters of the target page - e.g. for a route like `/blog/[slug]`, a `{ slug: string }` object.
		 * Is `null` if the target is not part of the SvelteKit app (could not be resolved to a route).
		 */
		params: Record<string, string> | null;
		/**
		 * Info about the target route
		 */
		route: { id: string | null };
		/**
		 * The URL that is navigated to
		 */
		url: URL;
	} | null;
	/**
	 * Where navigation is going to/has gone to
	 */
	to: {
		/**
		 * Parameters of the target page - e.g. for a route like `/blog/[slug]`, a `{ slug: string }` object.
		 * Is `null` if the target is not part of the SvelteKit app (could not be resolved to a route).
		 */
		params: Record<string, string> | null;
		/**
		 * Info about the target route
		 */
		route: { id: string | null };
		/**
		 * The URL that is navigated to
		 */
		url: URL;
	} | null;
	/**
	 * The type of navigation:
	 * - `form`: The user submitted a `<form>`
	 * - `leave`: The user is leaving the app by closing the tab or using the back/forward buttons to go to a different document
	 * - `link`: Navigation was triggered by a link click
	 * - `goto`: Navigation was triggered by a `goto(...)` call or a redirect
	 * - `popstate`: Navigation was triggered by back/forward navigation
	 */
	type: 'form' | 'leave' | 'link' | 'goto' | 'popstate';
	/**
	 * Whether or not the navigation will result in the page being unloaded (i.e. not a client-side navigation)
	 */
	willUnload: false;
	/**
	 * In case of a history back/forward navigation, the number of steps to go back/forward
	 */
	delta?: number;
	/**
	 * A promise that resolves once the navigation is complete, and rejects if the navigation
	 * fails or is aborted. In the case of a `willUnload` navigation, the promise will never resolve
	 */
	complete: Promise<void>;
}
```

as you can see it contains a lot of useful information to determine the page you are going to and conditionally apply classes based on the navigation.

An example could be this one

```svelte
<script>
	import { setupViewTransition } from 'sveltekit-view-transition';

	const { transition } = setupViewTransition();
</script>

<header
	use:transition={{
		name: 'header',
		classes({ navigation }) {
			if (navigation.to?.route?.id === '/') {
				return ['back'];
			}
		},
	}}
>
	<a href="/">Back</a>
</header>

<!-- your component -->
```

#### applyImmediately

By default when you specify a transition name it will only be applied when it's actually navigating following [the suggestion](https://twitter.com/jaffathecake/status/1697541871847748098) from Jake Archibald himself (the creator of the view transition api) that you should not add transition names to everything but only to the elements involved in the transition. Sometimes tho you want to add a transition name immediately (for example when you are coming back from a detail page and you want to animate back an image in the list).
`applyImmediately` is either a boolean or a function that take the navigation object (please note that this is the navigation object) from the previous page so the `from` will be the page that is navigating to this page and the `to` will be this page) and returns a boolean.

Here's a simple example of this in action

```svelte
<script>
	import { setupViewTransition } from 'sveltekit-view-transition';

	const { transition } = setupViewTransition();

	export let data;
</script>

<ul>
	{#each data.posts as post (post.id)}
		<li
			use:transition={{
				/**
				 * in the post/[id] page we have a matching title transition name
				 */
				name: 'title',
				applyImmediately(navigation) {
					// this will apply the title view transition to this element
					// only if it's the one that matches the id we are coming from
					// so for example if we were visiting /post/1 and this is the
					// post with id 1. Notice that i'm checking the `from` because
					// this will actually be called when the navigation is still happening
					// from post/1 to /
					return navigation?.from?.params?.id === post.id.toString();
				},
			}}
		>
			<a href="/post/{post.id}">{post.title}</a>
		</li>
	{/each}
</ul>
```

in this example when we navigate back from the `/post/1` page the title will slide in his right place in the list. Also important note: **the transition name will be added before the transition ends and removed immediately after to allow for a forward transition from another post to happen. If not removed the transition name would be duplicated**

#### shouldApply

As mentioned above this can be either a boolean or a function that takes a navigation object (this time the `from` is this page and the `to` is the page you are navigating to) and return a boolean. If the boolean is true the transition name will be applied. This is useful when you want to navigate from a list to a detail.

So completing the example above

```svelte
<script>
	import { setupViewTransition } from 'sveltekit-view-transition';

	const { transition } = setupViewTransition();

	export let data;
</script>

<ul>
	{#each data.posts as post (post.id)}
		<li
			use:transition={{
				/**
				 * in the post/[id] page we have a matching title transition name. Note that
				 * the transition name will only be applied moments before the actual transition
				 * if and when the shouldApply function returns true
				 */
				name: 'title',
				applyImmediately(navigation) {
					return navigation?.from?.params?.id === post.id.toString();
				},
				shouldApply(navigation) {
					// if the params.id i'm navigating to is equal to the id of the post
					// we add the title transition name.
					return navigation?.to?.params?.id === post.id.toString();
				},
			}}
		>
			<a href="/post/{post.id}">{post.title}</a>
		</li>
	{/each}
</ul>
```

### on

This function is returned from setupViewTransition and allows you to add a listener to run code in an arbitrary moment of the "lifecycle" of the view transition. It takes three arguments, the name of the event, the function and a boolean that indicates wether the callback should be added immediately (even if there's a transition running) or not. This is because there are events that runs after the component has mounted and if you add the listeners on mount specifying true as the third argument this listeners will be called immediately. This might be useful sometimes if you want to modify the state of after an incoming transition.

There are 7 types of events you can subscribe to in order of calling

- 'before-start-view-transition': event called before the transition even start if you modify the DOM here it will be included in the "screenshot" of the `view-transition`
- 'before-navigation': event called before SvelteKit start to handle the navigation the view transition has already been started
- 'before-navigation-complete': event called after SvelteKit started to handle the navigation but before it completes. The `view-transition` is still happening.
- 'after-navigation-complete': event called after the navigation from SvelteKit has completed. The `view-transition` is sill happening
- 'transition-ready': event called when the `view-transition` is ready, the pseudo-elements are created.
- 'update-callback-done': event called when the callback of the `view-transition` has finished running.
- 'transition-finished': event called when the `view-transition` finish and the new view is in place

The `on` function also returns a function that unregister the callback when called.

This function should be called inside the `afterNavigate` hook to ensure the registration even if the navigation is towards the same component.

### off

It's a function to unsubscribe a specific handle from a specific event. You will probably rarely use this given that the `on` function already returns the unsubscribe.

This function should be called inside the `afterNavigate` hook to ensure the registration even if the navigation is towards the same component.

### classes

Much like the `classes` function on the action this function can be called immediately in the script tag of a component to add a specific class to the `:root` element during a navigation. It can either be a array of strings or a function that returns an array of strings. The function takes as a parameter a navigation object just like the one from the action.

This function should be called inside the `afterNavigate` hook to ensure the registration even if the navigation is towards the same component.

```svelte
<script>
	import { setupViewTransition } from 'sveltekit-view-transition';
	import { afterNavigate } from '$app/navigation';

	const { classes } = setupViewTransition();

	afterNavigate(() => {
		classes(({ navigation }) => {
			if (navigation.to?.route.id === '/') {
				return ['back'];
			}
		});
	});
</script>
```
