const projectsJsonUrl = "https://robby-cell.github.io/data/projects.json";

const PROJECT_CLASSES = ["project-container"];
const PROJECT_NAME_CLASSES = ["project-name"];
const PROJECT_IMAGES_CONTAINER_CLASSES = ["project-images-container"];
const PROJECT_IMAGE_CLASSES = ["project-image"];
const PROJECT_CODE_SNIPPET_CONTAINER_CLASSES = ["project-code-snippet-container"];

const createProjectElement = (project) => {
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
        const codeSnippetCodeElement = document.createElement("code");
        if (project.language) {
            codeSnippetCodeElement.classList.add(`language-${project.language.toLowerCase()}`);
        }

        const code = Array.isArray(project.codeSnippet) ? project.codeSnippet.join("\n") : project.codeSnippet;
        codeSnippetCodeElement.textContent = code;

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
            imageElement.alt = project.imageAlt || `Image for ${project.name || 'project'}`;
            imageElement.loading = "lazy";
            imagesContainerElement.appendChild(imageElement);
        }
        pElement.appendChild(imagesContainerElement);
    }

    return pElement;
};

const renderProjects = (projects) => {
    const projectsContainer = document.querySelector('.projects-container');
    projectsContainer.innerHTML = '';
    projects.forEach(project => {
        const projectElement = createProjectElement(project);
        projectsContainer.appendChild(projectElement);
    });
};

const setupFiltering = (projects) => {
    const tabsContainer = document.getElementById('language-tabs');
    const languages = [...new Set(projects.map(p => p.language).filter(lang => lang))];

    tabsContainer.innerHTML = '';

    const allTab = document.createElement('div');
    allTab.className = 'language-tab active';
    allTab.textContent = 'All';
    allTab.dataset.language = 'all';
    tabsContainer.appendChild(allTab);

    languages.sort().forEach(lang => {
        const tab = document.createElement('div');
        tab.className = 'language-tab';
        tab.textContent = lang;
        tab.dataset.language = lang;
        tabsContainer.appendChild(tab);
    });

    tabsContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.language-tab');
        if (!tab) return;

        tabsContainer.querySelectorAll('.language-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const selectedLanguage = tab.dataset.language;
        const filteredProjects = selectedLanguage === 'all'
            ? projects
            : projects.filter(p => p.language === selectedLanguage);

        renderProjects(filteredProjects);
        if (window.Prism) {
            Prism.highlightAll();
        }
    });
};

const fetchProjects = async (url) => {
    const loadingMessageElement = document.querySelector('.loading-message');
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json();
        if (!Array.isArray(projects)) {
            throw new Error("Fetched data is not an array of projects.");
        }

        if (loadingMessageElement) {
            loadingMessageElement.remove();
        }

        renderProjects(projects);
        setupFiltering(projects);

        if (window.Prism) {
            Prism.highlightAll();
        }

    } catch (error) {
        console.error("Could not fetch or process portfolio projects:", error);
        if (loadingMessageElement) {
            loadingMessageElement.remove();
        }
        const projectsContainer = document.querySelector('.projects-container');
        projectsContainer.innerHTML = `<p class="error-message">Failed to load portfolio projects. Please try again later.</p>`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setupRouter();
    setupThemeSwitcher();
    setupBackToTopButton();
    fetchProjects(projectsJsonUrl);

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});