<main>
	<slot />
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		scrollbar-gutter: stable;
	}
	main {
		max-width: 1024px;
		padding: 1rem;
		margin: auto;
	}
</style>
