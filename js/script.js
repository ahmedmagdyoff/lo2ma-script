/* =====================================================
   1. LOAD MENU DATA
   ===================================================== */
let menu = [];
async function loadMenu() {
  const response = await fetch('data/products.json');
  menu = await response.json();
}
/* =====================================================
   4. RENDER MENU
   ===================================================== */
let activeCategory = "all";
function renderMenu() {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = "";
  const filtered = activeCategory === "all" ? menu : menu.filter(item => item.category === activeCategory);
  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.classList.add("food-card");
    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
        <span class="card-badge">${item.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${item.name}</h3>
        <p class="card-desc">${item.description}</p>
        <div class="card-footer">
          <span class="card-price">$${item.price.toFixed(2)}</span>
          <button class="add-btn" data-id="${item.id}" aria-label="Add ${item.name} to cart">
            <i class="fa-solid fa-plus"></i> Add
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}
/* =====================================================
   3. LOCALSTORAGE — load & save helpers
   ===================================================== */
let cart = [];
function loadCart() {
  const saved = localStorage.getItem("lo2maCart");
  cart = saved ? JSON.parse(saved) : [];
}
function saveCart() {
  localStorage.setItem("lo2maCart", JSON.stringify(cart));
}
/* =====================================================
   5. CART LOGIC
   ===================================================== */
function addToCart(itemId) {
  const item = menu.find(item => item.id === itemId);
  const existing = cart.find(item => item.id === itemId);
  if (existing) existing.quantity += 1;
  else cart.push({ ...item, quantity: 1 });
  saveCart();
  updateCartUI();
}
function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCart();
  updateCartUI();
  renderCartItems();
}
function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
  renderCartItems();
}
function changeQty(itemId, delta) {
  const item = cart.find(item => item.id === itemId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(itemId);
    return;
  }
  saveCart();
  updateCartUI();
  renderCartItems();
}
/* =====================================================
   6. RENDER CART DRAWER
   ===================================================== */
function renderCartItems() {
  const list = document.getElementById("cartItems");
  const empty = document.getElementById("cartEmpty");
  const footer = document.getElementById("cartFooter");
  list.innerHTML = "";
  if (cart.length === 0) {
    empty.classList.add("visible");
    footer.classList.remove("visible");
    return;
  }
  empty.classList.remove("visible");
  footer.classList.add("visible");
  cart.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("cart-item");
    li.dataset.id = item.id;
    li.innerHTML = `
      <img class="ci-img" src="${item.image}" alt="${item.name}" />
      <div class="ci-info">
        <p class="ci-name">${item.name}</p>
        <p class="ci-price">$${(item.price * item.quantity).toFixed(2)}</p>
        <div class="ci-controls">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
          <span class="ci-qty">${item.quantity}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="ci-remove" data-id="${item.id}" aria-label="Remove ${item.name} from cart">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    list.appendChild(li);
  });
}
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cartBadge").textContent = totalItems;
  document.getElementById("totalItems").textContent = totalItems;
  document.getElementById("totalPrice").textContent = `$${totalPrice.toFixed(2)}`;
}
/* =====================================================
   7. CART DRAWER OPEN / CLOSE
   ===================================================== */
function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  renderCartItems();
}
function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}
/* =====================================================
   9. CHECKOUT MODAL — OPEN / CLOSE
   ===================================================== */
function openCheckout() {
  const overlay = document.getElementById("checkoutOverlay");
  document.getElementById("checkoutForm").reset();
  renderSummary();
  overlay.classList.add("open");
}
function closeCheckout() {
  const overlay = document.getElementById("checkoutOverlay");
  overlay.classList.remove("open");
}
/* =====================================================
   10. ORDER SUMMARY (sidebar in checkout modal)
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
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("summaryTotal").textContent = `$${total.toFixed(2)}`;
}
/* =====================================================
   11. FORM VALIDATION
   ===================================================== */
function validateCheckoutForm() {
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
/* =====================================================
   12. PLACE ORDER
   ===================================================== */
function placeOrder() {
  const orderId = "LS-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  document.getElementById("orderId").textContent = orderId;
  cart = [];
  saveCart();
  updateCartUI();
  closeCheckout();
  const overlay = document.getElementById("successOverlay");
  overlay.classList.add("visible");
}
/* =====================================================
   14. EVENT LISTENERS — delegation & UI events
   ===================================================== */
function setupEvents() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.category;
      renderMenu();
    });
  });
  document.getElementById("menuGrid").addEventListener("click", e => {
    const btn = e.target.closest(".add-btn");
    if (!btn) return;
    const itemId = parseInt(btn.dataset.id);
    addToCart(itemId);
    btn.classList.add("added");
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Added`;
    setTimeout(() => {
      btn.classList.remove("added");
      btn.innerHTML = `<i class="fa-solid fa-plus"></i> Add`;
    }, 1000);
  });
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("closeCartBtn").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
  document.getElementById("clearCartBtn").addEventListener("click", clearCart);
  document.getElementById("cartItems").addEventListener("click", e => {
    const qtyBtn = e.target.closest(".qty-btn");
    if (qtyBtn) {
      const id = parseInt(qtyBtn.dataset.id);
      const delta = parseInt(qtyBtn.dataset.delta);
      changeQty(id, delta);
    }
    const removeBtn = e.target.closest(".ci-remove");
    if (removeBtn) {
      const id = parseInt(removeBtn.dataset.id);
      removeFromCart(id);
    }
  });
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    closeCart();
    openCheckout();
  });
  document.getElementById("closeCheckoutBtn").addEventListener("click", closeCheckout);
  document.getElementById("checkoutOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("checkoutOverlay")) closeCheckout();
  });
  document.getElementById("checkoutForm").addEventListener("submit", e => {
    e.preventDefault();
    if (validateCheckoutForm()) placeOrder();
  });
  document.getElementById("successBackBtn").addEventListener("click", () => {
    const overlay = document.getElementById("successOverlay");
    overlay.classList.remove("visible");
  });
}
/* =====================================================
   15. INIT — runs on page load
   ===================================================== */
async function init() {
  await loadMenu();
  loadCart();
  renderMenu();
  updateCartUI();
  setupEvents();
}
document.addEventListener("DOMContentLoaded", init);