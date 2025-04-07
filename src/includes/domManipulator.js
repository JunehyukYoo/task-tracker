// domManipulator.js
import { Task } from './task';
import { Project } from './project'
import { createTaskItem, createProjectItem, createToolBar, createTaskFormItem, createProjectFormItem, createFormSelectionItem } from "./domCreator";

/**
 *  RENDERING
 */

/**
 * Renders add button (for tasks and projects) statically.
 */
export function renderAddBtn(projectList) {
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
    addBtn.addEventListener("click", () => handleAdd(projectList));
    document.body.appendChild(addBtn);
}

/**
 * Renders a directory of current projects in a sidebar.
 * 
 * @param {Array[Project]} projects is the array of current projects.
 */
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

/**
 * Renders all content of a specific project, tasks sorted with the given method.
 * Renders a toolbar and contents (where task items live) separately. 
 * 
 * @param {Project} project is the current project to render.
 * @param {string} method is the sorting mode.
 */
export function renderContent(project, method = "created") {
    const content = document.querySelector("#content");
    content.innerHTML = "";

    const toolBar = createToolBar(project);
    toolBar.addEventListener('change', (e) => {
        const targetIdx = e.target.options.selectedIndex;
        const selectedMethod = e.target.options[targetIdx].value;
        renderTasksInProj(project, selectedMethod);
    });
    content.appendChild(toolBar);

    renderTasksInProj(project, method);
}

/**
 * Renders tasks in a project with tasks sorted in by a specific method.
 * Tasks are appended to '#content' DOM element found in ../template.html.
 * Kept in a separate function so task items change independently of the
 * toolbar.
 * 
 * @param {Project} project is the current project to render.
 * @param {string} method is the sorting mode.
 */
function renderTasksInProj(project, method) {
    const content = document.querySelector('#content');

    const tasksToRemove = document.querySelectorAll(".task-list");
    tasksToRemove.forEach((elem) => elem.remove());
    const tasksList = project.getSortedTasks(method);
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

/**
 * Renders a task in full (tile mode).
 * 
 * @param {Task} task is the current task.
 * @param {Project} project is the current project.
 */
function renderTaskTile(task, project) {
    const taskTile = createTaskItem(task, 'tile');
    taskTile.addEventListener('click', (e) => handleTaskClick(e, task, project));

    let modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.replaceChild(taskTile, modalOverlay.firstChild);
    } else {
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.appendChild(taskTile);
        document.body.appendChild(modalOverlay);
    }    
}

function renderForm(type, projectList, activeProject) {
    if (type === 'task') {
        const taskForm = createTaskFormItem();
        taskForm.addEventListener('submit', (e) => handleFormSubmit(e, projectList, activeProject));

        let modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.innerHTML = '';
            modalOverlay.appendChild(taskForm);
        } else {
            modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            modalOverlay.appendChild(taskForm);
            document.body.appendChild(modalOverlay);
        } 

        taskForm.querySelector('img').addEventListener('click', () => document.body.removeChild(modalOverlay));
    } else if (type == 'project') {
        const projForm = createProjectFormItem();
        projForm.addEventListener('submit', (e) => handleFormSubmit(e, projectList, activeProject));

        let modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.innerHTML = '';
            modalOverlay.appendChild(projForm);
        } else {
            modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            modalOverlay.appendChild(projForm);
            document.body.appendChild(modalOverlay);
        } 

        projForm.querySelector('img').addEventListener('click', () => document.body.removeChild(modalOverlay));
    }
}


/**
 *  EVENT HANDLING
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
    const isTile = e.target.parentNode.parentNode.classList.contains('task-tile');
    if (e.target.classList.contains("toggle-complete-button")) {
        task.toggleCompleted();
        renderContent(project);
        if (isTile) {
            renderTaskTile(task, project);
        }
    } else if (e.target.classList.contains("open-full-button")) {
        renderTaskTile(task, project);
    } else if (e.target.classList.contains("remove-task-button")) {
        if (isTile) {
            const modalOverlay = document.querySelector('.modal-overlay');
            document.body.removeChild(modalOverlay);
        }
        project.removeTask(task.id);
        renderContent(project);
    } else if (e.target.classList.contains('close-task-tile-button')) {
        const modalOverlay = document.querySelector('.modal-overlay');
        document.body.removeChild(modalOverlay);
    }
}

// Handles clicking the add button by displaying a modal
function handleAdd(projectList) {
    const formSelector = createFormSelectionItem();

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    
    modalOverlay.appendChild(formSelector);
    
    document.body.appendChild(modalOverlay);
    formSelector.querySelector(`img`).addEventListener("click", function () {
      document.body.removeChild(modalOverlay);
    }); 

    modalOverlay.querySelector("#add-task").addEventListener("click", () => renderForm('task', projectList));
    modalOverlay.querySelector("#add-project").addEventListener("click", () => renderForm('project', projectList));
}

// Handles form submission
function handleFormSubmit(e, projectList) {
    e.preventDefault();
    const activeProject = projectList.find(project => project.active);
    if (e.target.classList.contains('task-form')) {
        const newTask = new Task('temp', activeProject.id);
        for (let item of e.target.children) {
            if (item.value) {
                if (item.name === 'title') {
                    newTask.title = item.value;
                } else if (item.name === 'description') {
                    newTask.description = item.value;
                } else if (item.name === 'dueDate') {
                    newTask.dueDate = item.value;
                } else if (item.name === 'priority') {
                    newTask.priority = item.value.toUpperCase();
                } else if (item.name === 'notes') {
                    newTask.notes = item.value;
                }
            } 
        }
        activeProject.addTask(newTask);
        const modalOverlay = document.querySelector('.modal-overlay');
        document.body.removeChild(modalOverlay);
        renderContent(activeProject);
    } else if (e.target.classList.contains('project-form')) {
        const newProject = new Project('temp');
        for (let item of e.target.children) {
            if (item.value) {
                if (item.name === 'name') {
                    newProject.name = item.value;
                }
            } 
        }
        const modalOverlay = document.querySelector('.modal-overlay');
        document.body.removeChild(modalOverlay);
        projectList.push(newProject);
        renderSidebar(projectList);
    }
    
}