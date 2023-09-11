<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { setupViewTransition } from 'sveltekit-view-transition';
	const { transition } = setupViewTransition();
	let timeout: ReturnType<typeof setTimeout>;
	export let data;
</script>

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
	/><button>🔍</button>
</form>

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
			<a href="/details/{product.id}"><Card {...product} /></a>
		</li>
	{/each}
</ul>

<style>
	:global(body) {
		background-color: #eee;
		margin: 0;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
	}
	form {
		background-color: #fff;
		display: grid;
		grid-template-columns: 1fr min-content;
		padding: 1rem;
		border-bottom-left-radius: 2rem;
		border-bottom-right-radius: 2rem;
	}
	button {
		all: unset;
		padding: 0.5rem;
	}
	input {
		border-radius: 100vmax;
		border: 1px solid #777;
		padding-inline: 1rem;
	}
	ul {
		list-style: none;
		padding: 1rem;
		margin: 0;
		display: grid;
		gap: 2rem;
	}
	a {
		text-decoration: none;
		color: black;
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
