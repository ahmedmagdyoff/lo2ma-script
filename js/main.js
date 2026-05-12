import { initTheme } from './modules/theme/theme.js';
import { initMenu } from './modules/menu/menu.controller.js';
import { initCart } from './modules/cart/cart.controller.js';
document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    await initMenu();
    initCart();
});