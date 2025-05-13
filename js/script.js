const projectsJsonUrl = "https://robby-cell.github.io/data/projects.json"; // Ensure this is the correct URL

const PROJECT_CLASSES = ["project-container"];
const PROJECT_NAME_CLASSES = ["project-name"];
const PROJECT_IMAGES_CONTAINER_CLASSES = ["project-images-container"];
const PROJECT_IMAGE_CLASSES = ["project-image"];
const PROJECT_CODE_SNIPPET_CONTAINER_CLASSES = ["project-code-snippet-container"]; // New class for the snippet's div
// PROJECT_CODE_SNIPPET_CLASSES is used for the <code> element itself

/**
 * Creates language filter tabs and sets up filtering functionality.
 * @param {object[]} projects - Array of project objects.
 */
const setupLanguageTabs = (projects) => {
    const languages = [...new Set(projects.map(p => p.language).filter(lang => lang))]; // Filter out undefined/empty languages
    const tabsContainer = document.getElementById('language-tabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = ''; // Clear existing tabs

    // Add "All" tab
    const allTab = document.createElement('div');
    allTab.className = 'language-tab active';
    allTab.textContent = 'All';
    allTab.dataset.language = 'all';
    tabsContainer.appendChild(allTab);

    // Add language specific tabs
    languages.sort().forEach(lang => { // Sort languages alphabetically
        const tab = document.createElement('div');
        tab.className = 'language-tab';
        tab.textContent = lang;
        tab.dataset.language = lang;
        tabsContainer.appendChild(tab);
    });

    // Add click handlers using event delegation
    tabsContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.language-tab');
        if (!tab) return;

        // Update active tab
        tabsContainer.querySelectorAll('.language-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter projects
        const selectedLanguage = tab.dataset.language;
        document.querySelectorAll('.project-container').forEach(projectElement => {
            if (selectedLanguage === 'all' || projectElement.dataset.language === selectedLanguage) {
                projectElement.classList.remove('hidden');
            } else {
                projectElement.classList.add('hidden');
            }
        });
    });
};

/**
 * Converts a project object to an HTML element.
 * @param {object} project - The project data.
 * @returns {HTMLDivElement} - The project HTML element.
 */
const convertToProjectElement = (project) => {
    const pElement = document.createElement("div");
    pElement.classList.add(...PROJECT_CLASSES);
    if (project.language) {
        pElement.dataset.language = project.language;
    }

    const nameElement = document.createElement("a");
    nameElement.classList.add(...PROJECT_NAME_CLASSES);
    nameElement.innerText = project.name || "Unnamed Project";
    nameElement.href = project.url || "#";
    if (project.url) {
        nameElement.target = "_blank";
        nameElement.rel = "noopener noreferrer";
    }
    pElement.appendChild(nameElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.innerText = project.description || "No description available.";
    pElement.appendChild(descriptionElement);

    if (project.codeSnippet && project.codeSnippet.length > 0) {
        const codeSnippetContainer = document.createElement("div");
        codeSnippetContainer.classList.add(...PROJECT_CODE_SNIPPET_CONTAINER_CLASSES);

        const codeSnippetMessage = document.createElement("p");
        codeSnippetMessage.innerText = "Sample code:";
        codeSnippetContainer.appendChild(codeSnippetMessage);

        const codeSnippetPreElement = document.createElement("pre");
        // Prism requires the language class on the <pre> or <code> element.
        // It's common to put it on both or just <code>.
        // Let's ensure it's on the <code> element as per original and common Prism usage.
        const codeSnippetCodeElement = document.createElement("code");
        if (project.language) {
            codeSnippetCodeElement.classList.add(`language-${project.language.toLowerCase()}`);
        }
        // The class 'project-code-snippet' was on your original code element, let's keep it if you use it for styling.
        // codeSnippetCodeElement.classList.add("project-code-snippet");


        const code = Array.isArray(project.codeSnippet) ? project.codeSnippet.join("\n") : project.codeSnippet;
        codeSnippetCodeElement.textContent = code; // Use textContent for code to prevent XSS

        codeSnippetPreElement.appendChild(codeSnippetCodeElement);
        codeSnippetContainer.appendChild(codeSnippetPreElement);
        pElement.appendChild(codeSnippetContainer);
    }

    if (project.imageSources && project.imageSources.length > 0) {
        const imagesContainerElement = document.createElement("div");
        imagesContainerElement.classList.add(...PROJECT_IMAGES_CONTAINER_CLASSES);
        for (const imageSrc of project.imageSources) {
            const imageElement = document.createElement("img");
            imageElement.classList.add(...PROJECT_IMAGE_CLASSES);
            imageElement.src = imageSrc;
            imageElement.alt = project.imageAlt || `Image for ${project.name || 'project'}`; // Use provided alt or generate one
            imageElement.loading = "lazy"; // Lazy load images
            imagesContainerElement.appendChild(imageElement);
        }
        pElement.appendChild(imagesContainerElement);
    }

    return pElement;
};

/**
 * Fills the portfolio projects section by fetching data from a URL.
 * @param {string} url - Source URL for the projects.json file.
 */
async function fillPortfolio(url) {
    const portfolioSection = document.getElementById("portfolio");
    const projectsContainer = portfolioSection?.querySelector('.projects-container');
    const loadingMessageElement = projectsContainer?.querySelector('.loading-message');

    if (!portfolioSection || !projectsContainer) {
        console.error("Required portfolio elements not found in the HTML.");
        if (portfolioSection && !projectsContainer) { // If projects-container is missing, inject error there
            portfolioSection.innerHTML = `<p class="error-message">Error: Projects display area not found.</p>`;
        }
        return;
    }

    // Keep loading message until data is processed or an error occurs
    // loadingMessageElement is already in the HTML

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const projects = await response.json();

        if (!Array.isArray(projects)) {
            throw new Error("Fetched data is not an array of projects.");
        }

        if (loadingMessageElement) {
            loadingMessageElement.remove(); // Remove loading message
        }

        // Clear previous projects if any (e.g., if this function could be called multiple times)
        projectsContainer.innerHTML = '';


        if (projects.length === 0) {
            projectsContainer.innerHTML = `<p class="info-message">No projects to display at the moment.</p>`;
            // Also clear tabs if no projects
            const tabsContainer = document.getElementById('language-tabs');
            if (tabsContainer) tabsContainer.innerHTML = '';
            return;
        }

        setupLanguageTabs(projects); // Set up language tabs first

        projects.forEach(projectData => {
            const projectElement = convertToProjectElement(projectData);
            projectsContainer.appendChild(projectElement);
        });

        if (window.Prism) {
            Prism.highlightAll(); // Highlight syntax for newly added code
        }

    } catch (error) {
        console.error("Could not fetch or process portfolio projects:", error);
        if (loadingMessageElement) {
            loadingMessageElement.remove();
        }
        projectsContainer.innerHTML = `<p class="error-message">Failed to load portfolio projects. ${error.message}. Please try again later.</p>`;
        // Clear tabs in case of error too
        const tabsContainer = document.getElementById('language-tabs');
        if (tabsContainer) tabsContainer.innerHTML = '';
    }
}

/**
 * Sets the current year in the footer.
 */
function updateFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fillPortfolio(projectsJsonUrl);
    updateFooterYear();
});
