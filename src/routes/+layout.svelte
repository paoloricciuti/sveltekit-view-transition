<script lang="ts">
	import './global.css';
	import './tailwind.css';
</script>

<main class="grid h-full place-content-center place-items-center gap-8">
	<slot />
</main>

<style lang="postcss">
	:global(body) {
		--tw-gradient-stops: theme(gradientColorStops.slate.800), theme(gradientColorStops.slate.900);
		background-color: theme(colors.slate.800);
		background-attachment: fixed;
		background-image: theme(backgroundImage.gradient-to-br);
		color: theme(colors.slate.200);
		height: 100vh;
	}

	.current::after {
		content: '';
		position: absolute;
		z-index: -1;
		background-color: theme(colors.slate.300);
		inset: 0;
		top: 100%;
		height: 2px;
		view-transition-name: underline;
	}
</style>
