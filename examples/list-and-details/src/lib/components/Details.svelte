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

<div class="container">
	<article use:transition={'wrapper'}>
		<img use:transition={'image'} src={image} alt={title} />
		<strong use:transition={'price'}>
			{price.toFixed(2)} €
		</strong>
		<p class="title" use:transition={'title'}>{title}</p>
		<p class="description">{description}</p>
		<div class="category">{category}</div>
		<Rating {...rating} />
		<a href="/">Back</a>
	</article>
</div>

<style>
	.container {
		height: 100%;
	}

	article {
		max-width: 600px;
		margin: auto;
		margin-top: 2rem;
		position: relative;
		padding: 2rem;
		background-color: #fff;
		border-radius: 1rem;
		overflow: hidden;

		& img {
			aspect-ratio: 1;
			object-fit: contain;
			max-width: min(50%, 30rem);
			margin-inline: auto;
		}

		& strong {
			font-size: 3rem;
			color: #888;
		}

		& .title {
			font-size: 2rem;
			margin: 0;
			font-weight: bold;
		}

		& .description {
			margin-block: 1rem;
		}

		& .category {
			position: absolute;
			top: 0;
			left: 0;
			text-transform: uppercase;
			font-size: 0.75rem;
			font-weight: bold;
			background-color: rebeccapurple;
			color: white;
			padding: 1rem;
			border-bottom-right-radius: 0.75rem;
		}

		& a {
			display: block;
			text-align: center;
			background-color: hsl(243, 62%, 52%);
			padding: 0.75rem;
			text-transform: uppercase;
			color: white;
			font-weight: 600;
			text-decoration: none;
			margin-top: 1rem;
			border-radius: 4px;
		}
	}

	@media (max-width: 600px) {
		article {
			border-top-left-radius: 0;
			margin-top: 0;
		}
	}
</style>
