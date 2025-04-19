/**
 * @typedef {{
 *  name: string,
 *  url: string,
 *  description: string,
 *  codeSnippet: string[],
 *  language: string,
 *  imageSources: string[],
 * }} Project
 */

// projects to show.
const projectsJsonUrl = "https://robby-cell.github.io/data/projects.json";

const PROJECT_CLASSES = ["projects-container"];
const PROJECT_NAME_CLASSES = ["project-name"];
const PROJECT_IMAGES_CONTAINER_CLASSES = ["project-images-container"];
const PROJECT_IMAGE_CLASSES = ["project-image"];
const PROJECT_CODE_SNIPPET_CLASSES = [];

/**
 * Creates language filter tabs and sets up filtering functionality
 * @param {Project[]} projects 
 */
const setupLanguageTabs = (projects) => {
    const languages = [...new Set(projects.map(p => p.language))];
    const tabsContainer = document.getElementById('language-tabs');
    if (!tabsContainer) return;

    // Add "All" tab
    const allTab = document.createElement('div');
    allTab.className = 'language-tab active';
    allTab.textContent = 'All';
    allTab.dataset.language = 'all';
    tabsContainer.appendChild(allTab);

    // Add language specific tabs
    languages.forEach(lang => {
        const tab = document.createElement('div');
        tab.className = 'language-tab';
        tab.textContent = lang;
        tab.dataset.language = lang;
        tabsContainer.appendChild(tab);
    });

    // Add click handlers
    tabsContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.language-tab');
        if (!tab) return;

        // Update active tab
        document.querySelectorAll('.language-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter projects
        const selectedLanguage = tab.dataset.language;
        document.querySelectorAll('.projects-container').forEach(project => {
            if (selectedLanguage === 'all' || project.dataset.language === selectedLanguage) {
                project.classList.remove('hidden');
            } else {
                project.classList.add('hidden');
            }
        });
    });
};

/**
 * @param {Project} project
 * @returns {HTMLDivElement}
 */
const convertToProject = (project) => {
    const p = document.createElement("div");
    p.classList.add(...PROJECT_CLASSES);
    p.dataset.language = project.language;

    const nameElement = document.createElement("a");
    nameElement.classList.add(...PROJECT_NAME_CLASSES);
    nameElement.innerText = project.name;
    nameElement.href = project.url;
    p.appendChild(nameElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.innerText = project.description;
    p.appendChild(descriptionElement);

    if (project.codeSnippet !== undefined) {
        const codeSnippetContainer = document.createElement("div");
        const codeSnippetMessage = document.createElement("p");
        codeSnippetMessage.innerText = "Sample code:";
        codeSnippetContainer.appendChild(codeSnippetMessage);

        const codeSnippetElementContainer = document.createElement("pre");
        const codeSnippetElement = document.createElement("code");
        codeSnippetElement.classList.add(
            ...PROJECT_CODE_SNIPPET_CLASSES,
            `language-${project.language}`,
        );
        const code = project.codeSnippet.join("\n");
        codeSnippetElement.innerText = code;
        codeSnippetElementContainer.appendChild(codeSnippetElement);
        codeSnippetContainer.appendChild(codeSnippetElementContainer);

        p.appendChild(codeSnippetContainer);
    }

    if (project.imageSources && project.imageSources.length > 0) {
        const imagesElement = document.createElement("div");
        imagesElement.classList.add(...PROJECT_IMAGES_CONTAINER_CLASSES);
        for (const imageSrc of project.imageSources) {
            const imageElement = document.createElement("img");
            imageElement.classList.add(...PROJECT_IMAGE_CLASSES);
            imageElement.src = imageSrc;
            imagesElement.appendChild(imageElement);
        }
        p.appendChild(imagesElement);
    }

    return p;
};

/**
 * Fill the portfolio projects section.
 *
 * @param {any} url Source url for get all the projects (projects.json file URL)
 */
async function fillPortfolio(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json();

        const portfolioSection = document.getElementById("portfolio");
        if (!portfolioSection) {
            console.error("Portfolio section not found in index.html");
            return;
        }

        // Clear and set up the portfolio section
        portfolioSection.innerHTML = "<h2>My Portfolio</h2>";
        const tabsContainer = document.createElement('div');
        tabsContainer.id = 'language-tabs';
        portfolioSection.appendChild(tabsContainer);
        const projectsContainer = document.createElement('div');
        projectsContainer.classList.add('projects-container');
        portfolioSection.appendChild(projectsContainer);

        // Set up language tabs
        setupLanguageTabs(projects);

        // Add projects
        for (const projectData of projects) {
            const projectElement = convertToProject(projectData);
            projectsContainer.appendChild(projectElement);
        }
    } catch (error) {
        console.error("Could not fetch portfolio projects:", error);
        const portfolioSection = document.getElementById("portfolio");
        if (portfolioSection) {
            const errorMessage = document.createElement("p");
            errorMessage.innerText = "Failed to load portfolio projects. Please try again later.";
            portfolioSection.appendChild(errorMessage);
        }
    }
}

fillPortfolio(projectsJsonUrl);
