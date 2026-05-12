export function initTheme() {
    const saved = localStorage.getItem('lo2maTheme');
    if (!saved) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        applyTheme(prefersDark.matches ? 'dark' : 'light');
        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('lo2maTheme')) applyTheme(e.matches ? 'dark' : 'light');
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
    localStorage.setItem('lo2maTheme', next);
}