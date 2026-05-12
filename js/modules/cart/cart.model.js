import { state } from '../../core/state.js';
export function loadCart() {
    const saved = localStorage.getItem("lo2maCart");
    if (saved) state.cart = JSON.parse(saved);
}
export function saveCart() {
    localStorage.setItem("lo2maCart", JSON.stringify(state.cart));
}
export function addToCart(itemId) {
    const item = state.menu.find(item => item.id === itemId);
    const existing = state.cart.find(item => item.id === itemId);
    if (existing) existing.quantity += 1;
    else state.cart.push({ ...item, quantity: 1 });
    saveCart();
}
export function changeQuantity(itemId, delta) {
    const item = state.cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) removeFromCart(itemId);
        else saveCart();
    }
}
export function removeFromCart(itemId) {
    state.cart = state.cart.filter(item => item.id !== itemId);
    saveCart();
}
export function clearCart() {
    state.cart = [];
    saveCart();
}
export function getTotals() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { totalItems, totalPrice };
}