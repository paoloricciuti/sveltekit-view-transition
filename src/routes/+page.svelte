<script lang="ts">
	import { setupViewTransition } from '$lib';

	const { transition, on } = setupViewTransition();
	console.log('main page');
	on('before-navigation', () => console.log('before-navigation'));
	on('before-navigation-complete', () => console.log('before-navigation-complete'));
	on('before-start-view-transition', () => console.log('before-start-view-transition'));
	on('transition-finished', () => console.log('transition-finished'));
	on('transition-ready', () => console.log('transition-ready'));
	on('update-callback-done', () => console.log('update-callback-done'));
	export let data;
</script>

<header use:transition={'header'}>
	<a href="/newroute/0">New route</a>
</header>

<ul>
	{#each data.posts as post}
		<li>
			<a
				use:transition={{
					name: 'title',
					shouldApply({ navigation }) {
						return navigation.to?.params?.id === post.id.toString();
					},
					applyImmediately({ navigation }) {
						return navigation.from?.params?.id === post.id.toString();
					},
				}}
				href="/post/{post.id}">{post.title}</a
			>
		</li>
	{/each}
</ul>
