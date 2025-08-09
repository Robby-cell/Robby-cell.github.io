
const routes = {
    '#home': 'hero',
    '#portfolio': 'portfolio',
    '#about': 'about',
    '#contact': 'contact'
};

const setupRouter = () => {
    const handleRouteChange = () => {
        const hash = window.location.hash || '#home';
        const sectionId = routes[hash];

        if (sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                updateActiveNavLink(hash);
            }
        }
    };

    const updateActiveNavLink = (activeHash) => {
        document.querySelectorAll('#primary-navigation a').forEach(link => {
            if (link.getAttribute('href') === activeHash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('load', handleRouteChange);

    // Initial check
    handleRouteChange();
};

document.addEventListener('DOMContentLoaded', setupRouter);
