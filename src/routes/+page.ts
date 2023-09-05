export async function load({ fetch }) {
	const posts = fetch('https://jsonplaceholder.typicode.com/posts').then((res) => res.json());
	return {
		posts,
	};
}
