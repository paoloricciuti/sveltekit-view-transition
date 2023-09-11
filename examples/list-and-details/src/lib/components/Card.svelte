<script lang="ts">
	import type { OnNavigate } from '@sveltejs/kit';
	import Rating from './Rating.svelte';
	import { setupViewTransition } from 'sveltekit-view-transition';

	const { transition } = setupViewTransition();

	export let id: number;
	export let title: string;
	export let price: number;
	export let category: string;
	export let image: string;
	export let rating: {
		rate: number;
		count: number;
	};

	function shouldApply({ navigation }: { navigation: OnNavigate }) {
		console.log(id, navigation?.to?.params?.id === id.toString());
		return navigation?.to?.params?.id === id.toString();
	}
	function applyImmediately({ navigation }: { navigation: OnNavigate }) {
		return navigation?.from?.params?.id === id.toString();
	}
</script>

<article>
	<img
		use:transition={{
			name: 'image',
			shouldApply,
			applyImmediately
		}}
		src={image}
		alt={title}
	/>
	<p
		class="title"
		use:transition={{
			name: 'title',
			shouldApply,
			applyImmediately
		}}
	>
		{title}
	</p>
	<strong
		use:transition={{
			name: 'price',
			shouldApply,
			applyImmediately
		}}>{price.toFixed(2)} €</strong
	>
	<div class="category">{category}</div>
	<span>
		<Rating {...rating} />
	</span>
</article>

<style>
	article {
		--padding: 2rem;
		max-width: 100%;
		background-color: #fff;
		padding: var(--padding);
		border-radius: 1rem;
		position: relative;
		display: grid;
		grid-template-columns: 80% 20%;
		grid-template-rows: auto auto auto;
		overflow: hidden;
	}
	img {
		grid-column: 2;
		grid-row: 1/-1;
		position: absolute;
		inset: 0;
		height: calc(100% + var(--padding) * 2);
		width: 100%;
		object-fit: cover;
		object-position: left;
		margin-block: calc(var(--padding) * -1);
	}
	strong {
		color: #888;
		grid-column: 1;
	}
	.title {
		margin: 0;
		font-weight: bold;
	}
	.category {
		position: absolute;
		top: 0;
		left: 0;
		text-transform: uppercase;
		font-size: 0.75rem;
		font-weight: bold;
		background-color: rebeccapurple;
		color: white;
		padding: 0.375rem;
		border-bottom-right-radius: 0.75rem;
	}
	span {
		grid-column: 1;
	}
</style>
