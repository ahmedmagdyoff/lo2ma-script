import { cart } from './store.js';
import { clearCart } from './cart.js';
export function openCheckout() {
    const overlay = document.getElementById("checkoutOverlay");
    document.getElementById("checkoutForm").reset();
    renderSummary();
    overlay.classList.add("open");
}
export function closeCheckout() {
    const overlay = document.getElementById("checkoutOverlay");
    overlay.classList.remove("open");
}
function renderSummary() {
    const list = document.getElementById("summaryItems");
    list.innerHTML = "";
    cart.forEach(item => {
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
        list.appendChild(li);
    });
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("summaryTotal").textContent = `$${total.toFixed(2)}`;
}
export function validateCheckoutForm() {
    let valid = true;
    const fields = [
        { id: "firstName", msg: "First name is required" },
        { id: "lastName", msg: "Last name is required" },
        { id: "email", msg: "Valid email is required" },
        { id: "phone", msg: "Phone number is required" },
        { id: "address", msg: "Address is required" },
        { id: "city", msg: "City is required" },
    ];
    fields.forEach(({ id, msg }) => {
        const input = document.getElementById(id);
        const error = document.getElementById(id + "Error");
        input.classList.remove("error");
        if (error) error.textContent = "";
        if (!input.value.trim()) {
            input.classList.add("error");
            if (error) error.textContent = msg;
            valid = false;
        }
    });
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    if (emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        emailInput.classList.add("error");
        emailError.textContent = "Please enter a valid email";
        valid = false;
    }
    return valid;
}
export function placeOrder() {
    const orderId = "LS-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById("orderId").textContent = orderId;
    clearCart();
    closeCheckout();
    const overlay = document.getElementById("successOverlay");
    overlay.classList.add("visible");
}