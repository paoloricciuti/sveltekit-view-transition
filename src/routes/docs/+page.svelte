<script lang="ts">
	import Readme from '../../../README.md';
	import { setupViewTransition } from '$lib';

	const { transition } = setupViewTransition();
</script>

<header class="sticky top-0 bg-slate-900 p-4">
	<h1><code use:transition={'title'} class="text-2xl">`sveltekit-view-transition`</code></h1>
</header>
<section class="prose prose-invert prose-h1:hidden m-auto overflow-y-auto p-4">
	<Readme />
</section>
