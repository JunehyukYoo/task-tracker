// domManipulator.js

import folderClosedIcon from "../asset/folder_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import folderOpenIcon from "../asset/folder_open_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import openInFullIcon from "../asset/open_in_full_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import completeIcon from "../asset/toggle_on_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import incompleteIcon from "../asset/toggle_off_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import removeIcon from "../asset/delete_forever_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"

import { compareAsc, format } from "date-fns";

export function renderSidebar(projects) {
    const sidebar = document.querySelector("#sidebar");
    sidebar.innerHTML = "";

    const activeProject = projects.find(project => project.active);

    projects.forEach(project => {
        const projectItem = createProjectItem(project);
        projectItem.addEventListener("click", (e) => handleProjectClick(projects, project, activeProject));
        sidebar.appendChild(projectItem);
    });
}

export function renderContent(project, mode = "list") {
    const content = document.querySelector("#content");
    content.innerHTML = "";

    const toolBar = createToolBar(project);
    content.appendChild(toolBar);

    const taskList = project.tasks;
    if (taskList.length === 0) {
        content.textContent = "Empty project. Click the + button to add a task!";
    } else {
        taskList.forEach(task => {
            const taskItem = createTaskItem(task, mode);
            taskItem.addEventListener("click", (e) => handleTaskClick(e, task, project));
            content.appendChild(taskItem);
        });
    }    
}

// Handles clicking on projects in sidebar
function handleProjectClick(projectList, clickedProject, activeProject) {
    if (clickedProject === activeProject) {
        return;
    }
    clickedProject.toggleActive();
    activeProject.toggleActive();
    renderContent(clickedProject);
    renderSidebar(projectList);
}

// Handles clicking on task buttons
function handleTaskClick(e, task, project) {
    if (e.target.classList.contains("toggle-complete-button")) {
        task.toggleCompleted();
        renderContent(project);
    } else if (e.target.classList.contains("open-full-button")) {
        console.log("OPEN FULL TO BE IMPLEMENTED");
    } else if (e.target.classList.contains("remove-task-button")) {
        project.removeTask(task.id);
        renderContent(project);
    }
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
            <option value="created">Created</option>
            <option value="priority">Priority</option>
            <option value="duedate">Due Date</option>
        </select>
        `;
    // const displayToggleButton = document.createElement("button");
    // displayToggleButton.textContent = "Toggle";
    toolsWrapper.style = "display: flex; justify-content: center; align-items: center; height: 30px;";
    toolsWrapper.appendChild(sortDropdown);
    // toolsWrapper.appendChild(displayToggleButton);

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
// mode -> list sorting method
function createTaskItem(task, mode) {
    const taskItem = document.createElement("div");
    if (mode === "list") {
        // Title: fixed width (20%), no shrinking
        const taskTitle = document.createElement("div");
        taskTitle.textContent = task.title;
        taskTitle.style = "flex: 0 0 20%; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #d0c632; text-decoration: #d0c632 solid underline;";

        // Description: flexible, will shrink until its min-width is reached
        const taskDesc = document.createElement("div");
        taskDesc.textContent = task.description;
        // Allow it to grow and shrink but not below 100px (adjust as needed)
        taskDesc.style = "flex: 1 1 auto; min-width: 10px; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";

        // Due Date: fixed width (10%), no shrinking
        const taskDueDate = document.createElement("div");
        taskDueDate.textContent = `DUE: ${format(new Date(task.dueDate), "MMM dd, yyyy")}`;
        taskDueDate.style = "flex: 0 0 20%; min-width: 0;";

        // Priority: fixed width (10%), no shrinking
        const taskPriority = document.createElement("div");
        taskPriority.textContent = task.priority + " priority";
        taskPriority.style = "flex: 0 0 10%; min-width: 0;";

        // Status: fixed width (10%), no shrinking
        const taskStatus = document.createElement("div");
        taskStatus.textContent = task.completed ? "Complete" : "Incomplete";
        taskStatus.style = task.completed ? "flex: 0 0 10%; min-width: 0;" : "flex: 0 0 10%; min-width: 0; color: red";

        // Button Wrapper: fixed width (10%), with flex layout for the buttons
        const taskBtnWrapper = document.createElement("div");
        const toggleButton = task.completed ? completeIcon : incompleteIcon;
        taskBtnWrapper.innerHTML = `
        <img src="${toggleButton}" class="toggle-complete-button" id="toggle-${task.id}">
        <img src="${openInFullIcon}" class="open-full-button" id="open-${task.id}">
        <img src="${removeIcon}" class="remove-task-button" id="remove-${task.id}">
        `;
        taskBtnWrapper.style = "flex: 0 0 10%; min-width: 0; display: flex; justify-content: space-around; align-items: center;";

        taskItem.appendChild(taskTitle);
        taskItem.appendChild(taskDesc);
        taskItem.appendChild(taskDueDate);
        taskItem.appendChild(taskPriority);
        taskItem.appendChild(taskStatus);
        taskItem.appendChild(taskBtnWrapper);
    } else if (mode == "tile") {

    } else {
        throw new Error("Invalid task mode");
        
    }

    taskItem.classList.add(`task-${mode}`);
    return taskItem;
}