// domManipulator.js

export function renderSidebar(projects) {
    const sidebar = document.querySelector(".sidebar");
    sidebar.innerHTML = "";

    projects.forEach(project => {
        const projectItem = createProjectItem(project);
        sidebar.appendChild(projectItem);
    });
}

function createProjectItem(project) {
    const projectItem = document.createElement("div");
    projectItem.textContent = project.name;
    projectItem.classList.add("project-item");

    return projectItem;
}