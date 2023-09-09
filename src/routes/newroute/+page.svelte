<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { setupViewTransition } from '$lib';

	const { transition, on, classes } = setupViewTransition();
	console.log('newroute');
	afterNavigate(() => {
		classes(({ navigation }) => {
			if (navigation.to?.route.id === '/') {
				return ['back'];
			}
		});
		on('before-navigation', () => console.log('before-navigation'));
		on('before-navigation-complete', () => console.log('before-navigation-complete'));
		on('before-start-view-transition', () => console.log('before-start-view-transition'));
		on('transition-finished', () => console.log('transition-finished'));
		on('transition-ready', () => console.log('transition-ready'));
		on('update-callback-done', () => console.log('update-callback-done'));
	});
</script>

<header use:transition={'header'}>
	<a href="/">back</a>
</header>
<hr />
new route
