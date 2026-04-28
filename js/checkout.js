/**
 * Lo2ma Script — checkout.js
 * Handles: multi-step checkout flow, form validation,
 *          order summary rendering, and order placement.
 */

/* =====================================================
   1. STATE
   ===================================================== */
let cart = [];
let currentStep = 1;

/* =====================================================
   2. LOCALSTORAGE
   ===================================================== */
function loadCart() {
  try {
    const saved = localStorage.getItem("lo2maCart");
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem("lo2maCart", JSON.stringify(cart));
}

/* =====================================================
   3. RENDER ORDER SUMMARY (sidebar)
   ===================================================== */
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

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const delivery = subtotal >= 30 ? 0 : 3.99;
  const total = subtotal + delivery;

  document.getElementById("summarySubtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("summaryDelivery").textContent = delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`;
  document.getElementById("summaryDelivery").classList.toggle("delivery-fee", delivery === 0);
  document.getElementById("summaryTotal").textContent = `$${total.toFixed(2)}`;
}

/* =====================================================
   4. STEP NAVIGATION
   ===================================================== */
function goToStep(step) {
  currentStep = step;

  // Hide all form sections
  document.getElementById("deliveryForm").style.display = "none";
  document.getElementById("paymentForm").style.display = "none";
  document.getElementById("confirmSection").style.display = "none";

  // Show the current step
  if (step === 1) document.getElementById("deliveryForm").style.display = "";
  if (step === 2) document.getElementById("paymentForm").style.display = "";
  if (step === 3) {
    document.getElementById("confirmSection").style.display = "";
    renderConfirmation();
  }

  // Update step indicators
  document.querySelectorAll(".step").forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove("active", "completed");
    if (s === step) el.classList.add("active");
    if (s < step) el.classList.add("completed");
  });

  // Update step lines
  const lines = document.querySelectorAll(".step-line");
  lines.forEach((line, i) => {
    line.classList.toggle("active", i < step - 1);
  });

  // Scroll to top of form
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =====================================================
   5. FORM VALIDATION (Step 1)
   ===================================================== */
function validateDeliveryForm() {
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

  // Extra email format check
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("emailError");
  if (emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
    emailInput.classList.add("error");
    emailError.textContent = "Please enter a valid email";
    valid = false;
  }

  return valid;
}

/* =====================================================
   6. RENDER CONFIRMATION (Step 3)
   ===================================================== */
function renderConfirmation() {
  const details = document.getElementById("confirmDetails");

  const name = `${document.getElementById("firstName").value} ${document.getElementById("lastName").value}`;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const notes = document.getElementById("notes").value;

  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  const paymentLabels = {
    cash: "Cash on Delivery",
    card: "Credit / Debit Card",
    wallet: "Mobile Wallet",
  };

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const delivery = subtotal >= 30 ? 0 : 3.99;
  const total = subtotal + delivery;

  details.innerHTML = `
    <div class="confirm-block">
      <p class="confirm-block-title">Delivery Details</p>
      <p><strong>${name}</strong></p>
      <p><span>Email:</span> ${email}</p>
      <p><span>Phone:</span> ${phone}</p>
      <p><span>Address:</span> ${address}, ${city}</p>
      ${notes ? `<p><span>Notes:</span> ${notes}</p>` : ""}
    </div>
    <div class="confirm-block">
      <p class="confirm-block-title">Payment</p>
      <p><strong>${paymentLabels[paymentMethod]}</strong></p>
    </div>
    <div class="confirm-block">
      <p class="confirm-block-title">Order Total</p>
      <p><strong style="font-size:1.2rem;color:var(--clr-primary)">$${total.toFixed(2)}</strong>
         <span style="font-size:.82rem;margin-left:.4rem">(${cart.reduce((s, c) => s + c.quantity, 0)} items + ${delivery === 0 ? "Free" : "$" + delivery.toFixed(2)} delivery)</span></p>
    </div>
  `;
}

/* =====================================================
   7. PLACE ORDER
   ===================================================== */
function placeOrder() {
  // Generate a random order ID
  const orderId = "LS-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  document.getElementById("orderId").textContent = orderId;

  // Clear cart
  cart = [];
  saveCart();

  // Show success modal
  const overlay = document.getElementById("successOverlay");
  overlay.style.display = "flex";
  // Force reflow then animate
  requestAnimationFrame(() => {
    overlay.classList.add("visible");
  });
}

/* =====================================================
   8. PAYMENT METHOD TOGGLE
   ===================================================== */
function setupPaymentMethods() {
  const options = document.querySelectorAll(".payment-option");
  const cardDetails = document.getElementById("cardDetails");

  options.forEach(option => {
    option.addEventListener("click", () => {
      // Update active states
      options.forEach(o => o.classList.remove("active"));
      option.classList.add("active");
      option.querySelector("input").checked = true;

      // Show/hide card details
      const method = option.dataset.method;
      cardDetails.style.display = method === "card" ? "" : "none";
    });
  });
}

/* =====================================================
   9. INIT & EVENTS
   ===================================================== */
function init() {
  loadCart();

  const emptyState = document.getElementById("checkoutEmpty");
  const grid = document.getElementById("checkoutGrid");

  if (cart.length === 0) {
    emptyState.classList.add("visible");
    grid.style.display = "none";
    return;
  }

  emptyState.classList.remove("visible");
  grid.style.display = "";

  renderSummary();
  setupPaymentMethods();

  // Step 1 → 2
  document.getElementById("deliveryForm").addEventListener("submit", e => {
    e.preventDefault();
    if (validateDeliveryForm()) goToStep(2);
  });

  // Step 2 → 3
  document.getElementById("toConfirmBtn").addEventListener("click", () => {
    goToStep(3);
  });

  // Back buttons
  document.getElementById("backToDeliveryBtn").addEventListener("click", () => goToStep(1));
  document.getElementById("backToPaymentBtn").addEventListener("click", () => goToStep(2));

  // Place order
  document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
}

document.addEventListener("DOMContentLoaded", init);
