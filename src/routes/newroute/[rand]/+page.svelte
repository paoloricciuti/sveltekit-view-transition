<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { setupViewTransition } from '$lib';

	const { transition, on, classes } = setupViewTransition();
	classes(({ navigation }) => {
		console.log('classes?');
		if (navigation.to?.route.id === '/') {
			return ['back'];
		}
	});

	afterNavigate(() => {
		console.log('new nav');
	});
</script>

<header use:transition={'header'}>
	<a href="/">back</a>
</header>
<hr />
new route: {$page.params.rand}
<br />
<a href="/newroute/{Math.random()}">Next</a>
