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

## transition

`transition` is an action that accept a string as input and assign that string as the `view-transition-name` of that element. Plain and simple.

```svelte
<script>
	import { setupViewTransition } from 'sveltekit-view-transition';

	const { transition } = setupViewTransition();
</script>

<header use:transition="header" >
 <!-- links -->
</header>
<slot />
```

This will allow you to target the header with `::view-transition-old(header)` and `::view-transition-new(header)`
