<script lang="ts">
	import Post from '$lib/Post.svelte';
	import StorySelector from '$lib/StorySelector.svelte';
	import { stories as stories_data, photos } from '$lib/fake-data';

	const stories = Object.fromEntries(
		Object.entries(stories_data).map(([key, value]) => {
			return [key, value[0]];
		})
	);
</script>

<section class="stories">
	{#each Object.keys(stories) as user (user)}
		<StorySelector
			{user}
			user_url={stories[user].user.profile_picture_url}
			image_url={stories[user].image_url}
		/>
	{/each}
</section>
<section class="feed">
	{#each photos as photo (photo.id)}
		<Post {...photo} />
	{/each}
</section>

<style>
	.stories {
		overflow-x: auto;
		width: 100%;
		display: flex;
		gap: 1rem;
		padding: 0.5rem;
	}
	.feed {
		display: grid;
		gap: 2rem;
		place-items: center;
		margin-top: 2rem;
	}
</style>
