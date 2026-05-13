import { initTheme, toggleTheme } from './theme.js';
import { loadMenu, renderMenu, setActiveCategory } from './menu.js';
import { loadCart, updateCartUI, addToCart, removeFromCart, changeQty, clearCart, openCart, closeCart } from './cart.js';
import { openCheckout, closeCheckout, validateCheckoutForm, placeOrder } from './checkout.js';
function setupEvents() {
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
            btn.classList.add("active");
            setActiveCategory(btn.dataset.category);
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
    document.getElementById('successBackBtn').addEventListener('click', () => {
        const overlay = document.getElementById('successOverlay');
        overlay.classList.remove('visible');
    });
}
async function init() {
    initTheme();
    await loadMenu();
    loadCart();
    renderMenu();
    updateCartUI();
    setupEvents();
}
document.addEventListener("DOMContentLoaded", init);