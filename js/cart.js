import { cart, menu } from './store.js';
export function loadCart() {
    const saved = localStorage.getItem("lo2maCart");
    if (saved) {
        const parsed = JSON.parse(saved);
        cart.push(...parsed);
    }
}
export function saveCart() {
    localStorage.setItem("lo2maCart", JSON.stringify(cart));
}
export function addToCart(itemId) {
    const item = menu.find(item => item.id === itemId);
    const existing = cart.find(item => item.id === itemId);
    if (existing) existing.quantity += 1;
    else cart.push({ ...item, quantity: 1 });
    saveCart();
    updateCartUI();
}
export function removeFromCart(itemId) {
    const index = cart.findIndex(item => item.id === itemId);
    if (index !== -1) cart.splice(index, 1);
    saveCart();
    updateCartUI();
    renderCartItems();
}
export function clearCart() {
    cart.length = 0;
    saveCart();
    updateCartUI();
    renderCartItems();
}
export function changeQty(itemId, delta) {
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
export function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("cartBadge").textContent = totalItems;
    document.getElementById("totalItems").textContent = totalItems;
    document.getElementById("totalPrice").textContent = `$${totalPrice.toFixed(2)}`;
}
export function openCart() {
    document.getElementById("cartDrawer").classList.add("open");
    document.getElementById("cartOverlay").classList.add("open");
    renderCartItems();
}
export function closeCart() {
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("cartOverlay").classList.remove("open");
}