<script lang="ts">
	import Details from '$lib/components/Details.svelte';

	export let data;
</script>

<Details {...data.product} />
