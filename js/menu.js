// import { menu } from './store.js';
// export async function loadMenu() {
//   const response = await fetch('data/products.json');
//   const data = await response.json();
//   menu.push(...data);
// }
// let activeCategory = "all";
// export function setActiveCategory(category) {
//   activeCategory = category;
// }
// export function renderMenu() {
//   const grid = document.getElementById("menuGrid");
//   grid.innerHTML = "";
//   const filtered = activeCategory === "all" ? menu : menu.filter(item => item.category === activeCategory);
//   filtered.forEach((item) => {
//     const card = document.createElement("article");
//     card.classList.add("food-card");
//     card.innerHTML = `
//       <div class="card-img-wrap">
//         <img src="${item.image}" alt="${item.name}" loading="lazy" />
//         <span class="card-badge">${item.category}</span>
//       </div>
//       <div class="card-body">
//         <h3 class="card-name">${item.name}</h3>
//         <p class="card-desc">${item.description}</p>
//         <div class="card-footer">
//           <span class="card-price">$${item.price.toFixed(2)}</span>
//           <button class="add-btn" data-id="${item.id}" aria-label="Add ${item.name} to cart">
//             <i class="fa-solid fa-plus"></i> Add
//           </button>
//         </div>
//       </div>
//     `;
//     grid.appendChild(card);
//   });
// }