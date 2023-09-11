<script lang="ts">
	import { stories as stories_data } from '$lib/fake-data';
	import { page } from '$app/stores';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { setupViewTransition } from 'sveltekit-view-transition';

	const TIMEOUT = 5000;

	const { transition } = setupViewTransition();
	$: stories = stories_data[$page.params.id];

	let old_timeout: ReturnType<typeof setTimeout>;

	$: story_num = parseInt($page.url.searchParams.get('num')?.toString() ?? '0');
	$: current_story = stories[story_num];
	beforeNavigate(() => {
		clearInterval(old_timeout);
	});

	afterNavigate(() => {
		clearInterval(old_timeout);
		old_timeout = setTimeout(() => {
			if (story_num + 1 < stories.length) {
				const new_url = new URLSearchParams($page.url.search);
				new_url.set('num', (story_num + 1).toString());
				goto(`?${new_url}`);
			} else {
				if (stories_data[+$page.params.id + 1]) {
					goto(`/stories/${+$page.params.id + 1}`);
				}
			}
		}, TIMEOUT);
	});
</script>

<div use:transition={'stories'} class="stories">
	{#each stories as _, i}
		<div
			style:--timeout={TIMEOUT}
			class="indicator"
			class:active={i < story_num}
			class:current={i === story_num}
		></div>
	{/each}
</div>
<img
	use:transition={'story'}
	class="story"
	src={current_story.image_url}
	alt="{current_story.user.full_name} story"
/>
<section class="overlay" use:transition={'overlay'}>
	<section>
		<a href="/"
			><svg
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
					d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
				/>
			</svg>
		</a>
		<img
			use:transition={'user'}
			class="profile"
			src={current_story.user.profile_picture_url}
			alt={current_story.user.full_name}
		/>
	</section>
</section>

<style>
	.story {
		position: fixed;
		inset: 0;
		object-fit: cover;
		width: 100vw;
		height: 100vh;
	}
	.profile {
		width: 3rem;
		border-radius: 100vmax;
	}
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding: 1rem;
		padding-top: calc(1rem + 1vh);
		background-image: linear-gradient(black, transparent);
		min-height: 20%;
		& section {
			display: flex;
			align-items: center;
			& img {
				margin-left: auto;
			}
		}
		& a {
			color: white;
		}
	}
	.stories {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 1vh;
		display: flex;
		z-index: 2;
		gap: 0.25rem;
	}
	.indicator {
		background-color: hsl(0 100% 100% / var(--opacity, 0.3));
		width: 100%;
		height: 100%;
	}
	.active {
		--opacity: 0.7;
	}
	.current {
		background-color: transparent;
		background-image: linear-gradient(
			90deg,
			hsl(0 100% 100% / 0.3) 50%,
			hsl(0 100% 100% / 0.7) 50%
		);
		background-size: 200%;
		background-position: 0%;
		animation: running calc(var(--timeout) * 1ms) linear;
	}

	@keyframes running {
		to {
			background-position: -100%;
		}
	}
</style>
