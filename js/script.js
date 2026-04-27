/**
 * Lo2ma Script — script.js
 * Handles: menu rendering, category filtering,
 *          cart (add/remove/qty), localStorage persistence,
 *          cart drawer UI, and toast notifications.
 */

/* =====================================================
   1. MENU DATA
   Each item: id, name, description, price, category, image (Unsplash URL)
   ===================================================== */
const menuItems = [
  // ---- Burgers ----
  {
    id: 1,
    name: "Classic Smash Burger",
    description: "Double smashed patties, cheddar, caramelised onions & secret sauce.",
    price: 9.99,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80"
  },
  {
    id: 2,
    name: "Crispy Chicken Burger",
    description: "Buttermilk fried chicken, pickles, sriracha mayo & brioche bun.",
    price: 10.49,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80"
  },
  {
    id: 3,
    name: "Mushroom Swiss Melt",
    description: "Beef patty, sautéed mushrooms, Swiss cheese & garlic aioli.",
    price: 11.29,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=80"
  },

  // ---- Pizza ----
  {
    id: 4,
    name: "Margherita Classica",
    description: "San Marzano tomato, fresh mozzarella, basil & extra-virgin olive oil.",
    price: 12.99,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80"
  },
  {
    id: 5,
    name: "Pepperoni Blaze",
    description: "Double pepperoni, smoked mozzarella, chilli flakes & honey drizzle.",
    price: 14.49,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80"
  },
  {
    id: 6,
    name: "Truffle Mushroom",
    description: "White truffle base, wild mushrooms, fontina & fresh thyme.",
    price: 15.99,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80"
  },

  // ---- Drinks ----
  {
    id: 7,
    name: "Watermelon Lemonade",
    description: "Fresh watermelon, squeezed lemon, mint & a pinch of sea salt.",
    price: 4.49,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&q=80"
  },
  {
    id: 8,
    name: "Cold Brew Float",
    description: "Double-strength cold brew topped with salted-caramel ice cream.",
    price: 5.99,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80"
  },
  {
    id: 9,
    name: "Mango Chili Smoothie",
    description: "Ripe mango, coconut milk, lime juice & a hint of chilli.",
    price: 5.49,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1638176066959-e349398e5bb5?w=600&q=80"
  },

  // ---- Desserts ----
  {
    id: 10,
    name: "Burnt Basque Cheesecake",
    description: "Caramelised crust, silky cream-cheese centre & berry coulis.",
    price: 6.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80"
  },
  {
    id: 11,
    name: "Molten Lava Cake",
    description: "Warm dark-chocolate cake with a gooey centre & vanilla bean ice cream.",
    price: 7.49,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80"
  },
  {
    id: 12,
    name: "Pistachio Knafeh",
    description: "Crispy shredded pastry, sweet cheese, rose water & crushed pistachios.",
    price: 6.49,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&q=80"
  }
];

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
  const list    = document.getElementById("cartItems");
  const empty   = document.getElementById("cartEmpty");
  const footer  = document.getElementById("cartFooter");

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
      const id    = parseInt(qtyBtn.dataset.id);
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

  /* --- Checkout button (placeholder) --- */
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    showToast("✅ Order placed! Thank you 🎉");
    cart = [];
    saveCart();
    updateCartUI();
    renderCartItems();
    setTimeout(closeCart, 600);
  });

  /* --- Close cart on Escape key --- */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeCart();
  });
}

/* =====================================================
   10. INIT — runs on page load
   ===================================================== */
function init() {
  loadCart();       // restore cart from localStorage
  renderMenu();     // paint the menu grid
  updateCartUI();   // sync badge & totals
  setupEvents();    // attach all event listeners
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", init);
