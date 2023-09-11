<script lang="ts">
	import { page } from '$app/stores';
	import { photos, comments as comments_data } from '$lib/fake-data';
	import { setupViewTransition } from 'sveltekit-view-transition';

	const { transition } = setupViewTransition();

	const photo = photos.find((photo) => photo.id.toString() === $page.params.id);
	if (!photo) throw new Error('');
	const comments = comments_data.filter((comment) => comment.photo_id === photo.id);
</script>

<img use:transition={'post'} src={photo.image_url} alt={photo.description} />
<small use:transition={'details'}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-6 h-6"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
		/>
	</svg>
	{photo.likes} likes
</small>
<p use:transition={'description'}>
	<strong>@{photo.user.username.toLowerCase()}</strong>
	{photo.description}
</p>

{#each comments as comment}
	<p class="comment"><strong>@{comment.user.username.toLowerCase()}</strong> {comment.text}</p>
{/each}

<style>
	img {
		width: 100%;
	}
	.comment {
		padding-inline-start: 2rem;
	}
	small {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>
