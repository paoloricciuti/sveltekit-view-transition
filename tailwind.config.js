import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			borderWidth: {
				1: '1px',
			},
			fontSize: {
				fluid: 'clamp(.6rem, 1.5vw + .3rem, 1rem)',
				'fluid-xl': 'clamp(.6rem, 2.5vw + .3rem, 3rem)',
			},
		},
	},
	plugins: [typography],
};
