import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import { getHighlighter } from 'shiki';

const highlighter = await getHighlighter({ theme: 'css-variables' });

const config = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],
	highlight: {
		highlighter(code, lang) {
			const html = highlighter.codeToHtml(code, { lang });
			return `{@html \`${html
				.replace('%ts%', 'ts')
				.replaceAll('`', '\\`')
				.replaceAll('{', '\\{')}\`}`;
		},
	},
	smartypants: {
		dashes: 'oldschool',
	},

	remarkPlugins: [],
	rehypePlugins: [],
});

export default config;
