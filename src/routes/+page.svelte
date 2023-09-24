<script lang="ts">
	import BrowserWindow from '$components/BrowserWindow.svelte';
	import Mouse from '$components/Mouse.svelte';
	import { crossfade } from 'svelte/transition';
	import { setupViewTransition } from '$lib';

	const { transition } = setupViewTransition();

	const [send, receive] = crossfade({});
	let clicked = false;
	let clicking = false;
</script>

<main class="grid h-full place-content-center place-items-center gap-8">
	<BrowserWindow
		title="sveltekit-view-transition{clicked ? ' - Docs' : ''}"
		url="https://sveltekit-view-transition.vercel.app/{clicked ? 'docs' : ''}"
	>
		{#if !clicked}
			<main class="absolute inset-0 grid h-[80%] place-content-center place-items-center gap-2">
				<h1
					in:receive={{
						key: 'title',
					}}
					out:send={{
						key: 'title',
					}}
					class="text-fluid-xl"
				>
					<code use:transition={'title'}>`sveltekit-view-transition`</code>
				</h1>
				<a
					in:receive={{
						key: 'button',
					}}
					out:send={{
						key: 'button',
					}}
					href="/docs"
					class="relative inline-flex gap-2 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-500 px-4 py-2 shadow-lg"
					>Read the docs
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
						/>
					</svg>

					<span
						on:animationend={() => {
							clicking = true;
							setTimeout(() => {
								clicked = true;
							}, 500);
						}}
						class="mouse bottom-0 right-4"
					>
						<Mouse {clicking} />
					</span>
				</a>
				<p>
					<a
						class="flex items-center gap-2"
						href="https://github.com/paoloricciuti/sveltekit-view-transition"
						><svg
							in:receive={{
								key: 'github',
							}}
							out:send={{
								key: 'github',
							}}
							use:transition={'github'}
							aria-hidden="true"
							viewBox="0 0 16 16"
							version="1.1"
							class="h-4 w-4"
							fill="currentColor"
							><path
								fill-rule="evenodd"
								d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
							></path></svg
						> sveltekit-view-transition</a
					>
				</p>
				<p>
					Made with 🧡 by <a class="underline" href="https://twitter.com/paoloricciuti"
						>paoloricciuti</a
					>
				</p>
			</main>
		{:else}
			<main class="absolute inset-0">
				<header class="flex justify-between bg-slate-800 p-4">
					<h1
						in:receive={{
							key: 'title',
						}}
						out:send={{
							key: 'title',
						}}
						class="inline text-fluid-xl"
					>
						<code use:transition={'title'}>`sveltekit-view-transition`</code>
					</h1>
					<a href="https://twitter.com/paoloricciuti"
						><svg
							in:receive={{
								key: 'github',
							}}
							out:send={{
								key: 'github',
							}}
							use:transition={'github'}
							aria-hidden="true"
							viewBox="0 0 16 16"
							version="1.1"
							class="h-8 w-8"
							fill="currentColor"
							><path
								fill-rule="evenodd"
								d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
							></path></svg
						></a
					>
				</header>
				<p class="p-5 text-2xl font-bold">Getting started</p>
				<p class="px-5">
					<code>`sveltekit-view-transition`</code> is the easiest way to unlock the power of the browser
					based view transition inside your Svelte-kit application!
				</p>
				<div class="flex gap-2 p-5">
					<a
						in:receive={{
							key: 'button',
						}}
						out:send={{
							key: 'button',
						}}
						href="/docs"
						class="relative inline-flex gap-2 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-500 px-4 py-2 shadow-lg"
						>Read the docs
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
							/>
						</svg>
					</a>
					<button
						on:click={() => {
							clicked = false;
							clicking = false;
						}}
						class="relative inline-block gap-2 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-500 px-4 py-2 shadow-lg"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
							/>
						</svg>
					</button>
				</div>
			</main>
		{/if}
	</BrowserWindow>
</main>

<style>
	.mouse {
		position: absolute;
		animation: move-back 5s forwards ease-in;
		scale: 1.5;
	}

	@keyframes move-back {
		from {
			translate: 50vw 25vh;
		}
		90%,
		to {
			translate: 0;
		}
	}
</style>
