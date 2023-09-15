<script>
	export let title = 'Title';
	export let url = '';
</script>

<div class="browser">
	<div class="topbar">
		<button class="close" />
		<button class="minimize" />
		<button class="enlarge" />
		<span class="title">{title}</span>
	</div>
	<div class="url-bar">
		<div class="url">
			<button
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-4 w-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
					/>
				</svg>
			</button>
			{url}
		</div>
	</div>
	<div class="content">
		<slot />
	</div>
</div>

<style lang="postcss">
	button {
		display: flex;
		margin-bottom: 0;
	}

	.browser {
		position: fixed;
		inset: 5vmin;
		background-color: #222;
		border-radius: 0.5rem;
		overflow: hidden;
		--gap: 0.7%;
		font-family: sans-serif;
	}

	.topbar {
		display: flex;
		gap: var(--gap);
		padding: 0.75rem 0.75rem;
		background: var(--topbar, #555);
		color: var(--topbar-color, white);
		align-items: center;
		position: relative;
		font-size: theme(fontSize.fluid);
	}

	.topbar > :where(button) {
		border: 0;
		aspect-ratio: 1;
		width: 0.75rem;
		background-color: #ff605c;
		border-radius: 50%;
	}

	.minimize {
		background-color: #ffbd44;
	}

	.enlarge {
		background-color: #00ca4e;
	}

	.title {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-weight: 600;
	}

	.url-bar {
		background: var(--url-bar, #555);
		display: flex;
		align-items: center;
		gap: var(--gap);
		padding: 0.25rem 0.75rem 0.75rem;
	}

	.url-bar button {
		border: 0;
		background: transparent;
		color: black;
		aspect-ratio: 1;
	}

	.url {
		background: white;
		flex-basis: 100%;
		padding-block: 0.5rem;
		padding-inline: 1rem;
		border-radius: 50vmax;
		font-size: 0.85rem;
		display: flex;
		align-items: center;
		gap: var(--gap);
		overflow: hidden;
		white-space: nowrap;
		color: black;
	}

	.url > button {
		background: transparent;
		border: none;
		align-items: center;
	}

	.content {
		width: 100%;
		height: 100%;
		position: relative;
	}
</style>
