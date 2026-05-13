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
document.getElementById("checkoutForm").addEventListener("submit", e => {
    e.preventDefault();
    if (validateCheckoutForm()) placeOrder();
});