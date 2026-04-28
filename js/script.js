/**
 * Lo2ma Script — script.js
 * Unified script: menu, cart, checkout modal, order placement.
 */

/* =====================================================
   1. LOAD MENU DATA
   ===================================================== */
let menuItems = [];
async function loadMenu() {
  try {
    const response = await fetch('data/products.json');
    menuItems = await response.json();
  } catch (error) {
    console.error("Failed to load menu:", error);
  }
}

/* =====================================================
   2. STATE
   ===================================================== */
let cart = [];
let activeCategory = "all";

/* =====================================================
   3. LOCALSTORAGE — load & save helpers
   ===================================================== */

/** Load cart from localStorage on page start */
function loadCart() {
  try {
    const saved = localStorage.getItem("lo2maCart");
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }
}

/** Save current cart array to localStorage */
function saveCart() {
  localStorage.setItem("lo2maCart", JSON.stringify(cart));
}

/* =====================================================
   4. RENDER MENU
   ===================================================== */

/**
 * Build and inject food cards into #menuGrid.
 * Respects the activeCategory filter.
 */
function renderMenu() {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = ""; // clear previous cards

  // Filter items by selected category
  const filtered = activeCategory === "all"
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:var(--clr-muted);grid-column:1/-1;text-align:center;padding:3rem 0">Nothing here yet!</p>`;
    return;
  }

  filtered.forEach((item, i) => {
    const card = document.createElement("article");
    card.classList.add("food-card");
    card.setAttribute("role", "listitem");
    // Stagger card animations
    card.style.animationDelay = `${i * 0.06}s`;

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
   5. CART LOGIC
   ===================================================== */

/**
 * Add an item to the cart by its id.
 * If it already exists, just increment quantity.
 */
function addToCart(itemId) {
  const item = menuItems.find(m => m.id === itemId);
  if (!item) return;

  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`🛍 "${item.name}" added to cart`);
}

/**
 * Remove an item completely from cart by its id.
 */
function removeFromCart(itemId) {
  cart = cart.filter(c => c.id !== itemId);
  saveCart();
  updateCartUI();
  renderCartItems();
}

/**
 * Change quantity of a cart item.
 * If quantity drops to 0, remove the item.
 */
function changeQty(itemId, delta) {
  const item = cart.find(c => c.id === itemId);
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

/** Re-render the list of items inside the cart drawer */
function renderCartItems() {
  const list = document.getElementById("cartItems");
  const empty = document.getElementById("cartEmpty");
  const footer = document.getElementById("cartFooter");

  list.innerHTML = "";

  if (cart.length === 0) {
    // Show empty state, hide footer
    empty.classList.add("visible");
    footer.classList.remove("visible");
    return;
  }

  // Hide empty state, show footer
  empty.classList.remove("visible");
  footer.classList.add("visible");

  // Build each cart item row
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

/**
 * Update badge counter and totals — call after every cart change.
 */
function updateCartUI() {
  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  // Badge
  const badge = document.getElementById("cartBadge");
  badge.textContent = totalItems;
  badge.classList.remove("pop");
  void badge.offsetWidth; // reflow trick to re-trigger animation
  badge.classList.add("pop");

  // Totals in footer
  document.getElementById("totalItems").textContent = totalItems;
  document.getElementById("totalPrice").textContent = `$${totalPrice.toFixed(2)}`;
}

/* =====================================================
   7. CART DRAWER OPEN / CLOSE
   ===================================================== */

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden"; // prevent background scroll
  renderCartItems();
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* =====================================================
   8. TOAST NOTIFICATION
   ===================================================== */

let toastTimer = null;

/**
 * Show a short toast message at the bottom of the screen.
 * Auto-hides after 2.5s.
 */
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  // Clear any existing timer so toasts don't stack weirdly
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* =====================================================
   9. CHECKOUT MODAL — OPEN / CLOSE
   ===================================================== */

function openCheckout() {
  const overlay = document.getElementById("checkoutOverlay");
  const emptyState = document.getElementById("checkoutEmpty");
  const grid = document.getElementById("checkoutGrid");

  // Reset form
  document.getElementById("checkoutForm").reset();

  // Check if cart is empty
  if (cart.length === 0) {
    emptyState.classList.add("visible");
    grid.style.display = "none";
  } else {
    emptyState.classList.remove("visible");
    grid.style.display = "";
    renderSummary();
  }

  // Show the modal
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  const overlay = document.getElementById("checkoutOverlay");
  overlay.classList.remove("open");
  document.body.style.overflow = "";
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

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const delivery = subtotal >= 30 ? 0 : 3.99;
  const total = subtotal + delivery;

  document.getElementById("summarySubtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("summaryDelivery").textContent = delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`;
  document.getElementById("summaryDelivery").classList.toggle("delivery-fee", delivery === 0);
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
   12. PLACE ORDER
   ===================================================== */
function placeOrder() {
  // Generate a random order ID
  const orderId = "LS-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  document.getElementById("orderId").textContent = orderId;

  // Clear cart
  cart = [];
  saveCart();
  updateCartUI();

  // Close checkout modal
  closeCheckout();

  // Show success modal
  const overlay = document.getElementById("successOverlay");
  overlay.style.display = "flex";
  requestAnimationFrame(() => {
    overlay.classList.add("visible");
  });
}


/* =====================================================
   14. EVENT LISTENERS — delegation & UI events
   ===================================================== */

function setupEvents() {

  /* --- Category tab clicks --- */
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active from all, set on clicked
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.category;
      renderMenu();
    });
  });

  /* --- "Add to Cart" buttons (delegated on grid) --- */
  document.getElementById("menuGrid").addEventListener("click", e => {
    const btn = e.target.closest(".add-btn");
    if (!btn) return;

    const itemId = parseInt(btn.dataset.id);
    addToCart(itemId);

    // Brief visual feedback on the button
    btn.classList.add("added");
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Added`;
    setTimeout(() => {
      btn.classList.remove("added");
      btn.innerHTML = `<i class="fa-solid fa-plus"></i> Add`;
    }, 1200);
  });

  /* --- Open / close cart drawer --- */
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("closeCartBtn").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);

  /* --- Quantity & remove buttons (delegated on cart list) --- */
  document.getElementById("cartItems").addEventListener("click", e => {

    // Quantity change button
    const qtyBtn = e.target.closest(".qty-btn");
    if (qtyBtn) {
      const id = parseInt(qtyBtn.dataset.id);
      const delta = parseInt(qtyBtn.dataset.delta);
      changeQty(id, delta);
      return;
    }

    // Remove button
    const removeBtn = e.target.closest(".ci-remove");
    if (removeBtn) {
      const id = parseInt(removeBtn.dataset.id);
      removeFromCart(id);
    }
  });

  /* --- Checkout button — open checkout popup --- */
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    closeCart();
    // Small delay so the cart drawer closes before modal opens
    setTimeout(() => openCheckout(), 300);
  });

  /* --- Close checkout modal --- */
  document.getElementById("closeCheckoutBtn").addEventListener("click", closeCheckout);

  /* --- Click overlay to close checkout --- */
  document.getElementById("checkoutOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("checkoutOverlay")) {
      closeCheckout();
    }
  });

  /* --- Browse menu button (empty checkout state) --- */
  document.getElementById("checkoutBrowseBtn").addEventListener("click", () => {
    closeCheckout();
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });

  /* --- Checkout form submission (single step — validate & place order) --- */
  document.getElementById("checkoutForm").addEventListener("submit", e => {
    e.preventDefault();
    if (validateCheckoutForm()) {
      placeOrder();
    }
  });

  /* --- Success "Back to Home" button --- */
  document.getElementById("successBackBtn").addEventListener("click", () => {
    const overlay = document.getElementById("successOverlay");
    overlay.classList.remove("visible");
    overlay.style.display = "none";
  });

  /* --- Close cart / checkout on Escape key --- */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeCart();
      closeCheckout();
    }
  });
}

/* =====================================================
   15. INIT — runs on page load
   ===================================================== */
async function init() {
  await loadMenu(); // fetch menu items from json
  loadCart();       // restore cart from localStorage
  renderMenu();     // paint the menu grid
  updateCartUI();   // sync badge & totals
  setupEvents();    // attach all event listeners
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", init);
