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
	<div class="details">
		<div>
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
				}}
				class="price"
			>
				{price.toFixed(2)} €
			</strong>
		</div>

		<div class="category">{category}</div>

		<span class="rating">
			<Rating {...rating} />
		</span>
	</div>

	<div class="product">
		<img
			use:transition={{
				name: 'image',
				shouldApply,
				applyImmediately
			}}
			src={image}
			alt={title}
		/>
	</div>
</article>

<style>
	article {
		height: 300px;
		background-color: hsl(0 0% 96%);
		border-radius: 1rem;
		position: relative;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		overflow: hidden;

		& .details {
			display: grid;
			align-items: end;
			padding: 1rem;

			& .price {
				color: hsl(0 0% 40%);
			}

			& .rating {
				align-self: end;
			}
		}

		& .product {
			padding: 1rem;
			display: grid;
			place-content: center;
			background-color: hsl(0 0% 100%);

			& img {
				aspect-ratio: 1;
				object-fit: contain;
			}
		}
	}

	strong {
		color: #888;
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
		padding: 1rem;
		border-bottom-right-radius: 0.75rem;
	}

	span {
		grid-column: 1;
	}
</style>
