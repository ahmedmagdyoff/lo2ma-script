export const elements = {
    overlay: document.getElementById("checkoutOverlay"),
    form: document.getElementById("checkoutForm"),
    summaryItems: document.getElementById("summaryItems"),
    summaryTotal: document.getElementById("summaryTotal"),
    successOverlay: document.getElementById("successOverlay"),
    orderIdSpan: document.getElementById("orderId"),
    closeCheckoutBtn: document.getElementById("closeCheckoutBtn"),
    successBackBtn: document.getElementById("successBackBtn")
};
export function openCheckout() {
    clearErrors();
    elements.form.reset();
    elements.overlay.classList.add("open");
}
export function closeCheckout() {
    elements.overlay.classList.remove("open");
}
export function renderSummary(cartItems, totals) {
    elements.summaryItems.innerHTML = "";
    cartItems.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("summary-item");
        li.innerHTML = `
            <img class="summary-item-img" src="${item.image}" alt="${item.name}" />
            <div class="summary-item-info">
                <p class="summary-item-name">${item.name}</p>
                <p class="summary-item-qty">x${item.quantity}</p>
            </div>
            <span class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        elements.summaryItems.appendChild(li);
    });
    elements.summaryTotal.textContent = `$${totals.totalPrice.toFixed(2)}`;
}
export function displayErrors(errors) {
    clearErrors();
    for (const [field, msg] of Object.entries(errors)) {
        document.getElementById(field).classList.add("error");
        document.getElementById(`${field}Error`).textContent = msg;
    }
}
export function clearErrors() {
    elements.form.querySelectorAll("input").forEach(input => input.classList.remove("error"));
    elements.form.querySelectorAll(".field-error").forEach(span => span.textContent = "");
}
export function showSuccess(orderId) {
    elements.orderIdSpan.textContent = orderId;
    elements.successOverlay.classList.add("visible");
}
export function closeSuccess() {
    elements.successOverlay.classList.remove("visible");
}