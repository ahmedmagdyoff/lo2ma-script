import { state } from '../../core/state.js';
import { getProducts } from './menu.model.js';
import { renderProducts, updateActiveTab, elements } from './menu.view.js';
import { handleAddToCart } from '../cart/cart.controller.js';
let activeCategory = "all";
export async function initMenu() {
    try {
        const products = await getProducts();
        state.menu = products;
        renderProducts(state.menu);
        setupEventListeners();
    } catch (error) {
        console.error("Failed to load menu", error);
        if (elements.menuGrid) elements.menuGrid.innerHTML = "<p>عذراً، حدث خطأ أثناء تحميل القائمة.</p>";
    }
}
function filterMenu(category) {
    activeCategory = category;
    updateActiveTab(category);
    const filtered = category === "all" ? state.menu : state.menu.filter(item => item.category === category);
    renderProducts(filtered);
}
function setupEventListeners() {
    if (elements.categoryTabsContainer) {
        elements.categoryTabsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("tab-btn")) filterMenu(e.target.dataset.category);
        });
    }
    if (elements.menuGrid) {
        elements.menuGrid.addEventListener("click", (e) => {
            const btn = e.target.closest(".add-btn");
            if (!btn) return;
            handleAddToCart(parseInt(btn.dataset.id));
            btn.classList.add("added");
            btn.innerHTML = `<i class="fa-solid fa-check"></i> Added`;
            setTimeout(() => {
                btn.classList.remove("added");
                btn.innerHTML = `<i class="fa-solid fa-plus"></i> Add`;
            }, 1000);
        });
    }
}