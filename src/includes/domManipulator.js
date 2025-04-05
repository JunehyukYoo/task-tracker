// domManipulator.js

import folderClosedIcon from "../asset/folder_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import folderOpenIcon from "../asset/folder_open_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import openInFullIcon from "../asset/open_in_full_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import incompleteIcon from "../asset/toggle_on_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import completeIcon from "../asset/toggle_off_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import removeIcon from "../asset/delete_forever_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"

import { format } from "date-fns";

/**
 *  RENDERING
 */
export function renderAddBtn() {
    const addBtn = document.createElement("button");
    addBtn.innerHTML = `<svg
                            class="add-new-icon"
                            viewBox="0 0 24 24"
                            height="60px"
                            width="60px"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            stroke-width="1.5"
                            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                            ></path>
                            <path stroke-width="1.5" d="M8 12H16"></path>
                            <path stroke-width="1.5" d="M12 16V8"></path>
                        </svg>`;
    addBtn.classList.add("add-new-btn");
    addBtn.addEventListener("click", handleAdd);
    document.body.appendChild(addBtn);
}

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

export function renderContent(project, mode = "created") {
    const content = document.querySelector("#content");
    content.innerHTML = "";

    const toolBar = createToolBar(project);
    content.appendChild(toolBar);

    renderTasks(project, mode);
}

function renderTasks(project, mode) {
    const content = document.querySelector('#content');
    const tasksToRemove = document.querySelectorAll(".task-list");
    tasksToRemove.forEach((elem) => elem.remove());
    const tasksList = project.getSortedTasks(mode);
    console.log(tasksList);
    if (tasksList.length === 0) {
        content.textContent = "Empty project. Click the + button to add a task!";
    } else {
        tasksList.forEach(task => {
            const taskItem = createTaskItem(task);
            taskItem.addEventListener("click", (e) => handleTaskClick(e, task, project));
            content.appendChild(taskItem);
        });
    }
}

function renderTaskForm() {
    console.log("Render task form.");
}

function renderProjectForm() {
    console.log("Render project form.");
}


/**
 *  EVENT HANDLERS
 */

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
// Handles clicking the add button by displaying a modal
function handleAdd() {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Create the modal content container for choosing project or task
    modalOverlay.innerHTML = `
      <div class="modal-content">
        <button id="add-task">Add <span class="button-span">Task</span></button>
        <button id="add-project">Add <span class="button-span">Project</span></button>
        <button class="close-modal">Close</button>
      </div>
    `;
    
    document.body.appendChild(modalOverlay);
    modalOverlay.querySelector(".close-modal").addEventListener("click", function () {
      document.body.removeChild(modalOverlay);
    }); 

    modalOverlay.querySelector("#add-task").addEventListener("click", renderTaskForm);
    modalOverlay.querySelector("#add-project").addEventListener("click", renderProjectForm);
}

// Creates toolBar Dom element for content div
function createToolBar(project) {
    const toolBar = document.createElement("div");
    toolBar.classList.add("toolbar");

    const projName = document.createElement("div");
    projName.style = "font-size: 30px; height: 50px; margin-left: 1rem;";
    projName.textContent = `./${project.name}`;

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
    
    toolsWrapper.style = "display: flex; justify-content: center; align-items: flex-end; height: 30px;";
    toolsWrapper.appendChild(sortDropdown);

    toolBar.appendChild(projName);
    toolBar.appendChild(toolsWrapper);

    toolBar.addEventListener('change', (e) => {
        const targetIdx = e.target.options.selectedIndex;
        const selectedMode = e.target.options[targetIdx].value;
        console.log(selectedMode);
        renderTasks(project, selectedMode);
    });
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
function createTaskItem(task, mode = 'list') {
    const taskItem = document.createElement("div");
    if (mode === "list") {
        // Title: fixed width (20%), no shrinking
        const taskTitle = document.createElement("div");
        taskTitle.textContent = task.title;
        taskTitle.style = "flex: 0 0 20%; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 1rem; color: #d0c632; text-decoration: #d0c632 solid underline;";

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
        // TODO:
    } else {
        throw new Error("Invalid task mode");
    }
    taskItem.classList.add(`task-${mode}`);
    return taskItem;
}