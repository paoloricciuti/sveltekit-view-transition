<script lang="ts">
	import logo from '$lib/assets/logo.png';
</script>

<header>
	<a href="/" class="logo-wrapper">
		<img src={logo} alt="Logo" class="logo" />
		SvelteGram
	</a>
</header>
<slot />

<style>
	header {
		display: grid;
		place-items: center;
		gap: 2rem;
		margin-bottom: 1rem;
	}
	a {
		text-decoration: none;
		color: black;
	}
	.logo-wrapper {
		display: flex;
		align-items: center;
		font-size: clamp(0.5rem, 10vmin + 0.6rem, 3rem);
		font-weight: bold;
		font-family: cursive;
	}
	.logo {
		width: 1.5em;
	}
</style>
