import { state } from '../../core/state.js';
import * as Model from './checkout.model.js';
import * as View from './checkout.view.js';
import { getTotals, clearCart } from '../cart/cart.model.js';
import { updateCartView } from '../cart/cart.controller.js';
export function initCheckout() {
    setupCheckoutEvents();
}
export function handleOpenCheckout() {
    const totals = getTotals();
    if (totals.totalItems === 0) return;
    View.renderSummary(state.cart, totals);
    View.openCheckout();
}
function setupCheckoutEvents() {
    View.elements.closeCheckoutBtn?.addEventListener("click", View.closeCheckout);
    View.elements.overlay?.addEventListener("click", (e) => {
        if (e.target === View.elements.overlay) View.closeCheckout();
    });
    View.elements.form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(View.elements.form);
        const validation = Model.validateForm(formData);
        if (validation.isValid) {
            const orderId = Model.submitOrder(formData);
            View.closeCheckout();
            View.showSuccess(orderId);
            clearCart();
            updateCartView();
        } else View.displayErrors(validation.errors);
    });
    View.elements.successBackBtn?.addEventListener("click", View.closeSuccess);
}