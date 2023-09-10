import products_json from '$lib/products.json';

export async function load({ fetch, url: { searchParams } }) {
	const search = searchParams.get('search')?.toString() ?? '';
	// pretend this is an api search
	const products = products_json.filter((product) => {
		return product.title.toLowerCase().includes(search.toLowerCase());
	});
	return {
		products,
		search
	};
}
