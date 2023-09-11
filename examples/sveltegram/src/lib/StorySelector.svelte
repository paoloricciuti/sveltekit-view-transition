<script lang="ts">
	import type { OnNavigate } from '@sveltejs/kit';
	import { setupViewTransition } from 'sveltekit-view-transition';

	export let image_url: string;
	export let user_url: string;
	export let user: string;

	const { transition } = setupViewTransition();

	function shouldApply({ navigation }: { navigation: OnNavigate }) {
		return navigation.to?.params?.id === user.toString();
	}
	function applyImmediately({ navigation }: { navigation: OnNavigate }) {
		return navigation.from?.params?.id === user.toString();
	}
</script>

<a href="/stories/{user}" class="story">
	<img
		use:transition={{
			name: 'story',
			shouldApply,
			applyImmediately
		}}
		src={image_url}
		alt="{user} stories"
	/>
	<img
		use:transition={{
			name: 'user',
			shouldApply,
			applyImmediately
		}}
		class="user"
		src={user_url}
		alt="{user} stories"
	/>
</a>

<style>
	.story {
		position: relative;
		& img {
			border-radius: 100vmax;
			width: 5rem;
			aspect-ratio: 1;
		}
		& .user {
			border: 2px solid lime;
			width: 2rem;
			position: absolute;
			bottom: 0;
			right: 0;
		}
	}
</style>
