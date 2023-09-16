declare module '*.md' {
	import type { SvelteComponent, ComponentType } from 'svelte';
	const content: ComponentType<SvelteComponent>;
	export default content;
}
