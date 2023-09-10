<script lang="ts">
	export let rate: number;
	export let count: number;
</script>

{#each { length: 5 } as _, i}
	<span class:void={i > rate}>⭐️</span>
{/each}
out of {count}

<style>
	.void {
		filter: grayscale(1);
	}
</style>
