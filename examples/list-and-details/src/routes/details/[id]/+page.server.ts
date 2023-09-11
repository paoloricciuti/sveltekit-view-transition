import products from '$lib/products.json';

export async function load({ params: { id } }) {
	const product = products.find((product) => product.id.toString() === id);
	if (!product) throw new Error('Not found');
	return {
		product
	};
}
