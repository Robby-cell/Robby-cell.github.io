/**
 * @typedef {{
 *  name: string,
 *  url: string,
 *  description: string,
 *  codeSnippet: string[],
 *  imageSources: string[],
 * }} Project
 */

// projects to show.
const projectsJsonUrl = "https://robby-cell.github.io/data/projects.json";

const PROJECT_CLASSES = ["project-container"];
const PROJECT_NAME_CLASSES = ["project-name"];
const PROJECT_IMAGES_CONTAINER_CLASSES = ["project-images-container"];
const PROJECT_IMAGE_CLASSES = ["project-image"];
const PROJECT_CODE_SNIPPET_CLASSES = ["language-cpp"];

/**
 * @param {Project} project
 * @returns {HTMLDivElement}
 */
const convertToProject = (project) => {
    const p = document.createElement("div");
    p.classList.add(...PROJECT_CLASSES);

    const nameElement = document.createElement("a");
    nameElement.classList.add(...PROJECT_NAME_CLASSES);
    nameElement.innerText = project.name;
    nameElement.href = project.url;
    p.appendChild(nameElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.innerText = project.description;
    p.appendChild(descriptionElement);

    const codeSnippetContainer = document.createElement("div");
    const codeSnippetMessage = document.createElement("p");
    codeSnippetMessage.innerText = "Sample code:";
    codeSnippetContainer.appendChild(codeSnippetMessage);

    const codeSnippetElement = document.createElement("pre");
    codeSnippetElement.classList.add(...PROJECT_CODE_SNIPPET_CLASSES);
    codeSnippetElement.innerText = project.codeSnippet.join("\n");
    codeSnippetContainer.appendChild(codeSnippetElement);

    p.appendChild(codeSnippetContainer);

    if (project.imageSources && project.imageSources.length > 0) {
        const imagesElement = document.createElement("div");
        imagesElement.classList.add(...PROJECT_IMAGES_CONTAINER_CLASSES);
        for (const imageSrc of project.imageSources) {
            const imageElement = document.createElement("img");
            imageElement.classList.add(...PROJECT_IMAGE_CLASSES);
            imageElement.src = imageSrc;
            imagesElement.appendChild(imageElement); // Corrected: Append to imagesElement, not imageElement
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
async function fillPortfolio(url) { // Make the function async
    try {
        const response = await fetch(url); // Fetch the JSON data
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json(); // Parse JSON response

        const portfolioSection = document.getElementById("portfolio"); // Get the portfolio section
        if (!portfolioSection) {
            console.error("Portfolio section not found in index.html");
            return;
        }

        // Clear any existing content in the portfolio section (optional)
        portfolioSection.innerHTML = "<h2>My Portfolio</h2>"; // Keep the heading

        for (const projectData of projects) {
            const projectElement = convertToProject(projectData); // Convert data to HTML
            portfolioSection.appendChild(projectElement); // Add project to portfolio section
        }
    } catch (error) {
        console.error("Could not fetch portfolio projects:", error);
        // Optionally display an error message on the page
        const portfolioSection = document.getElementById("portfolio");
        if (portfolioSection) {
            const errorMessage = document.createElement("p");
            errorMessage.innerText =
                "Failed to load portfolio projects. Please try again later.";
            portfolioSection.appendChild(errorMessage);
        }
    }
}

fillPortfolio(projectsJsonUrl);
