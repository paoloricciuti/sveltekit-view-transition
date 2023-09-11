<script lang="ts">
	import { comments } from '$lib/fake-data';
	import type { Photo, User } from '$lib/fake-data';
	import type { OnNavigate } from '@sveltejs/kit';
	import { setupViewTransition } from 'sveltekit-view-transition';

	const { transition } = setupViewTransition();

	export let id: number;
	export let image_url: string;
	export let description: string;
	export let likes: number;
	export let user: User;
	type $$Props = Photo;

	function shouldApply({ navigation }: { navigation: OnNavigate }) {
		return navigation.to?.params?.id === id.toString();
	}
	function applyImmediately({ navigation }: { navigation: OnNavigate }) {
		return navigation.from?.params?.id === id.toString();
	}

	$: comments_num = comments.filter((comment) => comment.photo_id === id).length;
	$: comments_sentence = `comment${comments_num !== 1 ? 's' : ''}`;
</script>

<article>
	<a href="/photo/{id}">
		<img
			use:transition={{
				name: 'post',
				shouldApply,
				applyImmediately
			}}
			src={image_url}
			alt={description}
		/>
	</a>
	<small
		use:transition={{
			name: 'details',
			shouldApply,
			applyImmediately
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			width="24"
			height="24"
			stroke-width="1.5"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
			/>
		</svg>
		{likes} likes
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			width="24"
			height="24"
			stroke-width="1.5"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
			/>
		</svg>

		{comments_num}
		{comments_sentence}
	</small>

	<p
		use:transition={{
			name: 'description',
			shouldApply,
			applyImmediately
		}}
	>
		<strong>@{user.username.toLowerCase()}</strong>
		{description}
	</p>
</article>

<style>
	small {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	p {
		margin: 0;
	}
	article {
		max-width: 500px;
	}
	img {
		max-width: 100%;
	}
</style>
