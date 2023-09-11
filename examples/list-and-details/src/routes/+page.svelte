<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { setupViewTransition } from 'sveltekit-view-transition';
	const { transition } = setupViewTransition();
	let timeout: ReturnType<typeof setTimeout>;
	export let data;
</script>

<header>
	<span>Shoppe</span>
	<form data-sveltekit-keepfocus>
		<input
			on:input={(e) => {
				const form = e.currentTarget.form;
				clearTimeout(timeout);
				setTimeout(() => {
					form?.requestSubmit();
				}, 200);
			}}
			value={data.search}
			type="search"
			name="search"
		/>
		<button>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
			</svg>
		</button>
	</form>
</header>

<ul>
	{#each data.products as product (product.id)}
		<li
			use:transition={{
				name({ navigation }) {
					if (navigation.from?.url.pathname === navigation.to?.url.pathname) {
						return `product-${product.id}`;
					}
					return 'wrapper';
				},
				shouldApply({ navigation }) {
					console.log(navigation);
					if (navigation.from?.url.pathname === navigation.to?.url.pathname) {
						return true;
					}
					console.log(
						navigation.to?.params?.id,
						navigation.to?.params?.id === product.id.toString(),
						product.id
					);
					return navigation.to?.params?.id === product.id.toString();
				},
				applyImmediately({ navigation }) {
					return navigation.from?.params?.id === product.id.toString();
				}
			}}
		>
			<a href="/details/{product.id}">
				<Card {...product} />
			</a>
		</li>
	{/each}
</ul>

<style>
	header {
		display: flex;
		align-items: center;
		background-color: hsl(0, 0%, 96%);
		padding: 1rem;
		border-bottom-left-radius: 2rem;
		border-bottom-right-radius: 2rem;
		box-shadow: 0px 0px 2px hsl(0 0% 0% / 20%);

		& span {
			padding-inline: 1rem;
			font-weight: bold;
			text-transform: uppercase;
		}
	}

	form {
		width: 100%;
		max-width: 400px;
		display: grid;
		grid-template-columns: 1fr min-content;
		margin-inline: auto;

		& button {
			all: unset;
			padding: 0.5rem;
		}

		& input {
			width: 100%;
			border-radius: 100vmax;
			border: 1px solid hsl(0, 0%, 90%);
			padding-inline: 1rem;
		}
	}

	ul {
		list-style: none;
		padding: 2rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	/* exit animation */
	:global(::view-transition-old():only-child) {
		animation: fade-and-scale;
	}

	/* entry animation */
	:global(::view-transition-new():only-child) {
		animation: fade-and-scale;
		--from-scale-opacity: 1;
		--to-scale-opacity: 0;
	}

	@keyframes fade-and-scale {
		from {
			scale: var(--from-scale-opacity, 1);
			opacity: var(--from-scale-opacity, 1);
		}

		to {
			scale: var(--to-scale-opacity, 1);
			opacity: var(--to-scale-opacity, 1);
		}
	}
</style>
