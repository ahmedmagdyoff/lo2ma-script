import { fetchAPI } from '../../core/api.js';
export async function getProducts() {
    return await fetchAPI('products.php');
}