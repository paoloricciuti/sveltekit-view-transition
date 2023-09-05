export async function load({ fetch, params: { id } }) {
	const post = fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then((res) => res.json());
	return {
		post,
	};
}
