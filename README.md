# sveltekit-view-transition

Simplified `view-transition-api` for Sveltekit.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
![GitHub last commit](https://img.shields.io/github/last-commit/paoloricciuti/sveltekit-view-transition)
![npm](https://img.shields.io/npm/v/sveltekit-view-transition)
![npm](https://img.shields.io/npm/dt/sveltekit-view-transition)

## Before we begin: what is a view transition?

Svelte has kinda spoiled us: we have built in animations and transitions so that we can add a little bit of micro-interactions to our websites and apps. Do you need to animate a list reordering? `flip` comes to the rescue. Is a div moving and morphing from one list to another? `crossfade` is your friend. The web platform must have seen how much svelte developers love those kind of things and has provided us with a brand new, fully progressive enhance-able api: **[the view transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)**. This api not only allows you to animate between two states of your application regardless of the fact that two elements are actually the same or not (something that before was only possible with third party libraries or very complex code) but allows you to animate elements that are **on different pages**!

SvelteKit provides a way to hook into the navigation to allow the developer to start a view transition before the navigation and they do so with a very low level primitive. Here's how you can enable view transitions in SvelteKit

```ts
onNavigate((navigation) => {
	if (!document.startViewTransition) return;
	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
});
```

While not very complex, writing this snippets everywhere you need it can get quite tedious and sometimes based on how the `view-transition-api` works you might need to do other things like add classes or change the style of an element.

`sveltekit-view-transition` aim to ease the experience of writing easy and complex transitions in SvelteKit!

Before going in the details of how this library works and how to make use of it i want to leave here a [wonderful article](https://developer.chrome.com/docs/web-platform/view-transitions/) that explains what they are and how to use them in Vanilla JS from Jake Archibald, the main mind behind them.

> **Warning**
> While view transitions are cool please don't overuse them as having too much motion can worsten your users experience rather than enhance it. Also **PLEASE** respect your users preference for reduced motion with `@media (prefers-reduced-motion)`

## Installation

```bash
npm i -D sveltekit-view-transition@latest  # or pnpm/yarn
```

## Usage

### The simplest setup:

<sub>_src/routes/+layout.svelte_</sub>

```svelte
<script>
	import { setupViewTransition } from 'sveltekit-view-transition';

	setupViewTransition();
</script>

<slot />
```

This will automatically enable the default transition to every navigation.

### Modifying the defaults:

Optionally, the default animation can be modified via `::view-transition-old(root)` and `::view-transition-new(root)` like so:

<sub>_src/routes/+layout.svelte_</sub>

```svelte
<script>
	import { setupViewTransition } from 'sveltekit-view-transition';

	setupViewTransition();
</script>

<slot />

<style>
	/* Disable default crossfade. */
	:root {
		view-transition-name: none;
	}

	/* Or, just modify the duration. */
	:global(::view-transition-old(root)),
	:global(::view-transition-new(root)) {
		animation-duration: 2s;
	}
</style>
```

## `transition`

It's often useful to give specific parts of the page their own unique view transitions. We can do this by setting an element's `view-transition-name`.

One way to do this is with `transition`, a svelte [action](https://svelte.dev/tutorial/actions) returned by `setupViewTransition`.

`transition` accepts a string representing the `view-transition-name` that should be assigned to the element using it:

```svelte
<script>
	import { setupViewTransition } from 'sveltekit-view-transition';

	const { transition } = setupViewTransition();
</script>

<header use:transition={'header'}>
	<!-- links -->
</header>

<slot />

<style>
	:global(::view-transition-old(header)),
	:global(::view-transition-new(header)) {
		/* ... */
	}
</style>
```

As you can see, the header's view transition can now be modified via `::view-transition-old(header)` and `::view-transition-new(header)`.

## Additional Options

If you want to be a bit more creative with the transitions, you can pass an `object` to the `transition` action instead of a `string`. This object accepts the following options:

- `name`: the view-transition-name _(required)_
- `classes`: classnames to apply to the target element during the transition. An array of strings or a function that returns one.
- `applyImmediately`: Whether the transition should be applied immediately, or only during the actual navigation. A boolean or a function that returns one.
- `shouldApply`: Whether the transition should be applied or not. Can be a boolean or a function that returns one.

Let's take a look at each of these options in more detail:

### `name`

The `view-transition-name` -- the only required parameter. It can be a `string` _or_ a `function` that takes a navigation object and returns a string, and will be applied to the target element during the transition. This is equivalent to setting the style property `view-transition-name` on an element.

Apart from the `navigation` object this function also receive the `HTMLElement` of the action (it's the property `node` inside the prop object) and a boolean that express if this element is actually in the viewport at the time of the transition (it's the property `isInViewport` inside the prop object). This allow you to easily skip a transition if the element is not in the viewport to avoid having elements that fly off the viewport (inspired by this [tweet by Ryan Florence](https://x.com/ryanflorence/status/1706686168837054754))

### `classes`

Either an array of strings, or a function that returns an array of strings. These classes will be applied as classnames to the root element during the transition.

To demonstrate this, let's assume we want to apply a unique transition to our header anytime our "back" button is clicked.

This can be achieved by returning an array, i.e. `["back"]`, to our `classes` callback.

Apart from the `navigation` object this function also receive the `HTMLElement` of the action (it's the property `node` inside the prop object) and a boolean that express if this element is actually in the viewport at the time of the transition (it's the property `isInViewport` inside the prop object). This allow you to easily skip a transition if the element is not in the viewport to avoid having elements that fly off the viewport (inspired by this [tweet by Ryan Florence](https://x.com/ryanflorence/status/1706686168837054754))

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

<!-- etc -->
```

Now, we can target `.back::view-transition-old(back)` and `.back::view-transition-new(back)` in our CSS and those transitions will only be applied when navigating to the home page `/`.

In the example above, you can see we're destructuring `navigation` from the provided `OnNavigate` object _(the same object that sveltekit will pass to the `onNavigate` function)_. This object contains a lot of useful information, including the page you are navigating to, allowing us to apply classes conditionally based on the navigation.

<details>
<summary>Click here to see the full <code>Navigation</code> interface.</summary>

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

</details>

### `applyImmediately`

By default, the transition name you provide will only be applied during the actual navigation, following [the suggestion](https://twitter.com/jaffathecake/status/1697541871847748098) from Jake Archibald himself (the creator of the view transition api), which states that you shouldn't add transition names to everything -- instead, only to the elements involved in the transition. However, sometimes you want to add a transition name immediately _(for example, when you're navigating back from a "detail" page and you want to animate back an image in the list)_.

`applyImmediately` is either a `boolean` or a `function` that take the `navigation` object _(please note that this is the navigation object from the previous page, so the `from` will be the page that is navigating to the current page, and the `to` will be the current page)_ and returns a boolean.

Apart from the `navigation` object this function also receive the `HTMLElement` of the action (it's the property `node` inside the prop object) and a boolean that express if this element is actually in the viewport at the time of the transition (it's the property `isInViewport` inside the prop object). This allow you to easily skip a transition if the element is not in the viewport to avoid having elements that fly off the viewport (inspired by this [tweet by Ryan Florence](https://x.com/ryanflorence/status/1706686168837054754))

Here's a simple example of this in action:

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

In this example, when we navigate back from the `/post/1` page, the title will slide into the its position in the list.

> Important Note: **the transition name will be added before the transition ends and removed immediately after to allow for a forward transition from another post to happen. If not removed the transition name would be duplicated.**

### `shouldApply`

As mentioned above, this can be either a `boolean` or a `function` that takes a `navigation` object _(this time the `from` is this page and the `to` is the page you are navigating to)_ and returns a `boolean`. If the return value is `true` the transition name will be applied, otherwise it will not. This is useful when, for example, you want to navigate from a list to a detail.

NB: the default is true so if you don't pass `shouldApply` the transition name will be applied every time.

Apart from the `navigation` object this function also receive the `HTMLElement` of the action (it's the property `node` inside the prop object) and a boolean that express if this element is actually in the viewport at the time of the transition (it's the property `isInViewport` inside the prop object). This allow you to easily skip a transition if the element is not in the viewport to avoid having elements that fly off the viewport (inspired by this [tweet by Ryan Florence](https://x.com/ryanflorence/status/1706686168837054754))

So, completing the example above:

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

## More advanced usage

### `on`

This function is returned from `setupViewTransition`, and allows you to add a listener to run code during an arbitrary moment of the "lifecycle" of the view transition. It takes three arguments; the name of the event, the main callback function, and a series of options.

| option name              | type      | meaning                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| registerDuringTransition | `boolean` | Wether the callback should be added immediately _(even if there's a transition running)_ or not. This is because there are events that runs after the component has mounted, and if you add the listeners on mount specifying true as the third argument, this listeners will be called immediately. This might be useful if, for example, you want to modify the state after an incoming transition. |
| autoWrap                 | `boolean` | By default the function will be internally wrapped in `afterNavigate` (to reassign the listeners even if the navigation is towards the same page) but you can pass `autoWrap` as `false` to avoid wrapping the add listener in `afterNavigate`.                                                                                                                                                       |
| autoClean                | `boolean` | wether the listener clean automatically after has been applied or it requires manual cleaning. It defaults to true                                                                                                                                                                                                                                                                                    |

There are 7 types of events you can subscribe to in order of calling:

| Event Name                     | Description                                                                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `before-start-view-transition` | event called before the transition even start if you modify the DOM here it will be included in the "screenshot" of the `view-transition` |
| `before-navigation`            | Event called before SvelteKit start to handle the navigation the view transition has<br> already been started                             |
| `before-navigation-complete`   | Event called after SvelteKit started to handle the navigation but before it completes.<br>_The `view-transition` is still happening_      |
| `after-navigation-complete`    | Event called after the navigation from SvelteKit has completed.<br><em>The `view-transition` is still happening</em>                      |
| `transition-ready`             | Event called when the `view-transition` is ready, the pseudo-elements are created.                                                        |
| `update-callback-done`         | Event called when the callback of the `view-transition` has finished running.                                                             |
| `transition-finished`          | Event called when the `view-transition` finish and the new view is in place                                                               |

The `on` function also returns a function that unregister the callback when called.

### `off`

A function to unsubscribe a specific handle from a specific event. This will rarely be necessary given that the `on` function already returns unsubscribe.

By default the function will be internally wrapped in `afterNavigate` (to reassign the listeners even if the navigation is towards the same page) but you can pass a third parameter as `false` to avoid wrapping the remove listener in `afterNavigate`.

### `classes`

Much like the `classes` function on the action, this function can be called immediately in the script tag of a component to add a specific class to the `:root` element during a navigation. It can either be a array of strings or a function that returns an array of strings. The callback provides a `navigation` object (just like the one from the action).

By default the function will be internally wrapped in `afterNavigate` (to reassign the listeners even if the navigation is towards the same page) but you can pass a second parameter as `false` to avoid wrapping the add listener in `afterNavigate`.

```svelte
<script>
	import { setupViewTransition } from 'sveltekit-view-transition';

	const { classes } = setupViewTransition();

	classes(({ navigation }) => {
		if (navigation.to?.route.id === '/') {
			return ['back'];
		}
	});
</script>
```

## Examples

You can find some example of usage in the [examples](https://github.com/paoloricciuti/sveltekit-view-transition/tree/main/examples/) folder.

| Example                                                                                                            | SvelteLab link                                                                                                       | Live demo                                       | Features                                                                |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------- |
| [list-and-details](https://github.com/paoloricciuti/sveltekit-view-transition/tree/main/examples/list-and-details) | [link](https://sveltelab.dev/github.com/paoloricciuti/sveltekit-view-transition/tree/main/examples/list-and-details) | [link](https://svt-list-and-details.vercel.app) | entry/exit animation, dynamic name, page transition from list to detail |
| [sveltegram](https://github.com/paoloricciuti/sveltekit-view-transition/tree/main/examples/sveltegram)             | [link](https://sveltelab.dev/github.com/paoloricciuti/sveltekit-view-transition/tree/main/examples/sveltegram)       | [link](https://svt-sveltegram.vercel.app)       | multiple element transitions, conditional apply based on route          |

## Contributing

Contributions are always welcome!

For the moment there's no code of conduct or contributing guideline, but if you've found a problem or have an idea, feel free to [open an issue](https://github.com/paoloricciuti/sveltekit-view-transition/issues/new)

For the fastest way to open a PR, try out Codeflow:

[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://pr.new/paoloricciuti/sveltekit-view-transition/)

## Authors

- [@paoloricciuti](https://www.github.com/paoloricciuti)
