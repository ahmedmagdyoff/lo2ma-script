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
   cart: array of { ...item, quantity }
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
    // If parsing fails just start fresh
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
   9. EVENT LISTENERS — delegation & UI events
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

  /* --- Checkout button — navigate to checkout page --- */
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    closeCart();
    window.location.href = "checkout.html";
  });

  /* --- Close cart on Escape key --- */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeCart();
  });
}

/* =====================================================
   10. INIT — runs on page load
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
