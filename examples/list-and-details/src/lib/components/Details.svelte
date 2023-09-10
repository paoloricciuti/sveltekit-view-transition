<script lang="ts">
	import Rating from './Rating.svelte';
	import { setupViewTransition } from 'sveltekit-view-transition';

	const { transition } = setupViewTransition();

	export let title: string;
	export let price: number;
	export let description: string;
	export let category: string;
	export let image: string;
	export let rating: {
		rate: number;
		count: number;
	};
</script>

<article use:transition={'wrapper'}>
	<img use:transition={'image'} src={image} alt={title} />
	<strong use:transition={'price'}>{price.toFixed(2)} €</strong>
	<p class="title" use:transition={'title'}>{title}</p>
	<p class="description">{description}</p>
	<div class="category">{category}</div>
	<Rating {...rating} />
	<a href="/">Back</a>
</article>

<style>
	article {
		max-width: 100%;
		min-height: 100vh;
		background-color: #fff;
		padding: 2rem;
		position: relative;
	}
	img {
		max-width: 50%;
		margin: auto;
		display: block;
	}
	strong {
		font-size: 3rem;
		color: #888;
	}
	.title {
		font-size: 2rem;
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
	a {
		display: block;
		text-align: center;
		background-color: hsl(243, 62%, 52%);
		padding: 0.75rem;
		text-transform: uppercase;
		color: white;
		font-weight: 600;
		text-decoration: none;
		margin-top: 1rem;
	}
</style>
