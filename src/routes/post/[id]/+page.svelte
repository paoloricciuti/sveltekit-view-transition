<script lang="ts">
	import { setupViewTransition } from '$lib';

	const { transition } = setupViewTransition();
	export let data;
</script>

<a href="/">back</a>
<h1 use:transition={'title'}>{data.post.title}</h1>
