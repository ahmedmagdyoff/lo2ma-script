const THEME_KEY = 'lo2maTheme';
export function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (!saved) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        applyTheme(prefersDark.matches ? 'dark' : 'light');
        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light');
        });
    } else applyTheme(saved);
}
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}
export function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
}