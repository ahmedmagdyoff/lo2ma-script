export const elements = {
    drawer: document.getElementById("cartDrawer"),
    overlay: document.getElementById("cartOverlay"),
    list: document.getElementById("cartItems"),
    badge: document.getElementById("cartBadge"),
    totalItems: document.getElementById("totalItems"),
    totalPrice: document.getElementById("totalPrice"),
    footer: document.getElementById("cartFooter"),
    emptyState: document.getElementById("cartEmpty"),
    cartBtn: document.getElementById("cartBtn"),
    closeBtn: document.getElementById("closeCartBtn"),
    clearBtn: document.getElementById("clearCartBtn"),
    checkoutBtn: document.getElementById("checkoutBtn")
};
export function openCart() {
    elements.drawer?.classList.add("open");
    elements.overlay?.classList.add("open");
}
export function closeCart() {
    elements.drawer?.classList.remove("open");
    elements.overlay?.classList.remove("open");
}
export function renderCart(cartItems, totals) {
    if (elements.badge) elements.badge.textContent = totals.totalItems;
    if (elements.totalItems) elements.totalItems.textContent = totals.totalItems;
    if (elements.totalPrice) elements.totalPrice.textContent = `$${totals.totalPrice.toFixed(2)}`;
    if (totals.totalItems > 0) {
        elements.footer?.classList.add("visible");
        elements.emptyState?.classList.remove("visible");
    } else {
        elements.footer?.classList.remove("visible");
        elements.emptyState?.classList.add("visible");
    }
    if (elements.list) {
        elements.list.innerHTML = "";
        cartItems.forEach(item => {
            const li = document.createElement("li");
            li.classList.add("cart-item");
            li.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="ci-img" />
            <div class="ci-info">
                <p class="ci-name">${item.name}</p>
                <p class="ci-price">$${(item.price * item.quantity).toFixed(2)}</p>
                <div class="ci-controls">
                    <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
                    <span class="ci-qty">${item.quantity}</span>
                    <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
                </div>
            </div>
            <button class="ci-remove" data-id="${item.id}">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
            elements.list.appendChild(li);
        });
    }
}