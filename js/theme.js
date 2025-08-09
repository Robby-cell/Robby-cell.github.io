
const setupThemeSwitcher = () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    const applyTheme = (theme) => {
        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(theme);
        localStorage.setItem('theme', theme);
    };

    themeToggleButton.onclick = () => {
        const currentTheme = localStorage.getItem('theme') || 'light-theme';
        const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
        applyTheme(newTheme);
    };

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    applyTheme(savedTheme);
};

document.addEventListener('DOMContentLoaded', setupThemeSwitcher);
