import products from '$lib/products.json';
import { fail } from '@sveltejs/kit';

export async function load({ params: { id } }) {
	const product = products.find((product) => product.id.toString() === id);
	if (!product) throw new Error('Not found');
	return {
		product
	};
}
