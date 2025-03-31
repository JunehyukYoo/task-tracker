// domManipulator.js

import folderClosedIcon from "../asset/folder_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"
import folderOpenIcon from "../asset/folder_open_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"

export function renderSidebar(projects) {
    const sidebar = document.querySelector("#sidebar");
    sidebar.innerHTML = "";

    projects.forEach(project => {
        const projectItem = createProjectItem(project);
        sidebar.appendChild(projectItem);
    });
}

export function renderContent(project, mode = "list") {
    const content = document.querySelector("#content");
    content.innerHTML = "";

    const toolBar = createToolBar(project);
    content.appendChild(toolBar);

    const taskList = project.tasks;
    taskList.forEach(task => {
        const taskItem = createTaskItem(task, mode);
        content.appendChild(taskItem);
    });
}

// Creates toolBar Dom element for content div
function createToolBar(project) {
    const toolBar = document.createElement("div");
    toolBar.classList.add("toolbar");

    const projName = document.createElement("div");
    projName.style = "font-size: 25px; height: 30px;";
    projName.textContent = project.name;

    const toolsWrapper = document.createElement("div");
    const sortDropdown = document.createElement("div");
    sortDropdown.innerHTML = `
        <label for="sort">Sort: </label>
        <select name="sort" id="sort">
            <option value="created">Date created</option>
            <option value="priority">Priority</option>
            <option value="duedate">Due Date</option>
        </select>
        `;
    const displayToggleButton = document.createElement("button");
    displayToggleButton.textContent = "Toggle";
    toolsWrapper.style = "display: flex; justify-content: center; align-items: center; height: 30px;";
    toolsWrapper.appendChild(sortDropdown);
    toolsWrapper.appendChild(displayToggleButton);

    toolBar.appendChild(projName);
    toolBar.appendChild(toolsWrapper);
    return toolBar;

}

// Creates project DOM element for sidebar div
function createProjectItem(project) {
    const projectItem = document.createElement("div");
    const iconHtml = project.active ? `<img src="${folderOpenIcon}"/>` : `<img src="${folderClosedIcon}"/>`;
    projectItem.innerHTML = `<span class="material-symbols-outlined" style="margin-right: 3px">${iconHtml}</span>${project.name}`;
    projectItem.classList.add("project-item");

    return projectItem;
}

// Creates a task DOM element for content div
function createTaskItem(task, mode) {
    const taskItem = document.createElement("div");
    taskItem.textContent = task.title;
    taskItem.classList.add(`task-${mode}`);

    return taskItem;
}