export const elements = {
    menuGrid: document.getElementById("menuGrid"),
    categoryTabsContainer: document.querySelector(".category-tabs"),
    categoryTabs: document.querySelectorAll(".tab-btn")
};
export function renderProducts(products) {
    elements.menuGrid.innerHTML = "";
    products.forEach((item) => {
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
        elements.menuGrid.appendChild(card);
    });
}
export function updateActiveTab(activeCategory) {
    elements.categoryTabs.forEach(btn => {
        if (btn.dataset.category === activeCategory) btn.classList.add("active");
        else btn.classList.remove("active");
    });
}