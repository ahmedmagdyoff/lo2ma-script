import { state } from '../../core/state.js';
import * as Model from './cart.model.js';
import * as View from './cart.view.js';
export function initCart() {
    Model.loadCart();
    updateCartView();
    setupCartEvents();
}
export function handleAddToCart(itemId) {
    Model.addToCart(itemId);
    updateCartView();
}
function updateCartView() {
    View.renderCart(state.cart, Model.getTotals());
}
function setupCartEvents() {
    document.getElementById("cartBtn")?.addEventListener("click", View.openCart);
    document.getElementById("closeCartBtn")?.addEventListener("click", View.closeCart);
    document.getElementById("clearCartBtn")?.addEventListener("click", () => {
        Model.clearCart();
        updateCartView();
    });
    View.elements.list?.addEventListener("click", (e) => {
        const qtyBtn = e.target.closest(".qty-btn");
        if (qtyBtn) {
            Model.changeQuantity(parseInt(qtyBtn.dataset.id), parseInt(qtyBtn.dataset.delta));
            updateCartView();
        }
        const removeBtn = e.target.closest(".ci-remove");
        if (removeBtn) {
            Model.removeFromCart(parseInt(removeBtn.dataset.id));
            updateCartView();
        }
    });
}