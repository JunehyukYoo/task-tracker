// domManipulator.js
import { Task } from './task';
import { Project } from './project'
import { createTaskItem, createProjectItem, createToolBar, createTaskFormItem, createProjectFormItem, createFormSelectionItem } from "./domCreator";

// Store list of projects as a global variable
var projectList = [];

/**
 * Initialize dynamic rendering of webpage. Entry point into
 * rest of logic in the webpage. 
 */
export function init() {
    // window.localStorange handling
    if (storageAvailable('localStorage')) {
        const storedProjects = localStorage.getItem('projectList');
        if (!storedProjects) {
            // Default project on first-open
            const defaultProject = new Project("default");
            defaultProject.toggleActive();

            const sampleTask1 = new Task(
                "Complete Assignment",
                defaultProject.id,
                "Finish math assignment and review class notes.",
                new Date(2025, 5, 14),
                "High",
                `Assignment Details:
                - Read textbook chapters 4 and 5.
                - Solve practice problems.
                - Write a brief summary for each chapter.
                - Proofread and review the final submission.
                Ensure all guidelines provided by your instructor are met.`
            );
            
            const sampleTask2 = new Task(
                "Go workout",
                defaultProject.id,
                "Hit full body day.",
                new Date(2025, 4, 9),
                "Low",
                `Workout Plan:
                - Warm-up: 5-10 minutes of light cardio and dynamic stretching.
                - Bench Press: 3 sets x 10 reps at 70% of your max.
                - Squats: 3 sets x 8 reps at 75% of your max.
                - Deadlifts: 3 sets x 5 reps at 80% of your max.
                - Overhead Press: 3 sets x 10 reps at 60% of your max.
                - Dumbbell Rows: 3 sets x 12 reps per arm.
                - Cool Down: 5 minutes of stretching and foam rolling.
                Remember to rest 1-2 minutes between sets and focus on proper form for each exercise.`
            );
            
            const sampleTask3 = new Task(
                "Grocery Shopping",
                defaultProject.id,
                "Buy weekly groceries from the local market.",
                new Date(2026, 4, 12),
                "Medium",
                `Shopping List:
                - Fruits: Apples, bananas, and berries.
                - Vegetables: Carrots, broccoli, and spinach.
                - Dairy: Milk, cheese, and yogurt.
                - Others: Bread, eggs, and coffee.
                Plan your shopping route and look out for weekly deals.`
            );
            
            sampleTask2.toggleCompleted();

            defaultProject.addTask(sampleTask1);
            defaultProject.addTask(sampleTask2);
            defaultProject.addTask(sampleTask3);

            projectList = [defaultProject];
            updateLocalStorage();
        } else {
            // Populate localStorage
            const jsonList = JSON.parse(storedProjects);
            console.log(jsonList);
            const newProjectList = [];
            jsonList.forEach((projectRaw) => {
                const newProject = Project.fromJson(projectRaw);
                console.log(newProject);
                newProjectList.push(newProject);
            });
            projectList = newProjectList;
        }
    }

    // Rendering logic
    renderAddBtn();
    if (projectList.length !== 0) {
        const activeProject = projectList.find(project => project.active);
        renderContent(activeProject);
    } else {
        renderContent();
    }
    renderSidebar();
}

/**
 * Code from: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 * 
 * @param {string} type is the type of storage method to check: 'localStorage' | 'sessionStorage'
 * @returns true if Web Storage API is avaliable 
 */
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
        );
    }
}

/**
 * Update localStorage with the current projectList.
 * This function is only called when a change is made. 
 */
function updateLocalStorage() {
    console.log("Updating localStorage...")
    if (storageAvailable('localStorage')) {
        localStorage.setItem('projectList', JSON.stringify(projectList));
    }
}
  

/**
 *  --------------RENDERING--------------
 */

/**
 * Renders add button (for tasks and projects) statically.
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

/**
 * Renders a directory of current projects in a sidebar.
 */
export function renderSidebar() {
    const sidebar = document.querySelector("#sidebar");
    sidebar.innerHTML = "";

    if (projectList.length === 0) {
        return;
    }

    projectList.forEach(project => {
        const projectItem = createProjectItem(project);
        projectItem.addEventListener("click", (e) => handleProjectClick(e, project));
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

    if (!project) {
        return;
    }

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

/**
 * Renders the form with the specified type.
 * 
 * @param {string} type is the type of form to display.
 */
function renderForm(type) {
    if (type === 'task') {
        const taskForm = createTaskFormItem();
        taskForm.addEventListener('submit', handleFormSubmit);

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
        projForm.addEventListener('submit', handleFormSubmit);

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
 *  --------------EVENT HANDLING--------------
 */


/**
 * Handles the event where a project on the sidebar is clicked. This includes 
 * toggling between projects and removing them. 
 * 
 * @param {Event} e is the event where a project div on the sidebar is clicked.
 * @param {Project} clickedProject is the specific project clicked.
 */
function handleProjectClick(e, clickedProject) {
    if (e.target.classList.contains('remove-project-button')) {
        if (projectList.length === 1) {
            projectList = [];
            renderSidebar();
            renderContent();
            updateLocalStorage();
            return;
        }

        console.log(e.target);
        const projectId = e.target.id.slice(e.target.id.indexOf('-') + 1);

        const toRemoveIdx = projectList.findIndex(project => project.id === projectId);
        let toDisplay = null;
        if (toRemoveIdx == projectList.length - 1) {
            toDisplay = projectList[0];
        } else {
            toDisplay = projectList[toRemoveIdx + 1];
        }

        if (!toDisplay.active) {
            toDisplay.toggleActive();
        }
        
        projectList.splice(toRemoveIdx, 1);
        renderSidebar();
        renderContent(toDisplay);
        updateLocalStorage();
    } else {
        if (projectList.length === 1) {
            return;
        }
        const activeProject = projectList.find(project => project.active);
        if (clickedProject === activeProject) {
            return;
        }
        clickedProject.toggleActive();
        activeProject.toggleActive();
        renderContent(clickedProject);
        renderSidebar();
        updateLocalStorage();
    }
    
}

/**
 * Handles the event where a task is clicked. This includes the toggle completed button,
 * the expand button, and the remove button.
 * 
 * @param {Event} e is the current event where a task has been clicked.
 * @param {Task} task is the task which was clicked.
 * @param {Project} project of this specific task.
 */
function handleTaskClick(e, task, project) {
    const isTile = e.target.parentNode.parentNode.classList.contains('task-tile');
    if (e.target.classList.contains("toggle-complete-button")) {
        task.toggleCompleted();
        renderContent(project);
        if (isTile) {
            renderTaskTile(task, project);
        }
        updateLocalStorage();
    } else if (e.target.classList.contains("open-full-button")) {
        renderTaskTile(task, project);
    } else if (e.target.classList.contains("remove-task-button")) {
        if (isTile) {
            const modalOverlay = document.querySelector('.modal-overlay');
            document.body.removeChild(modalOverlay);
        }
        project.removeTask(task.id);
        renderContent(project);
        updateLocalStorage();
    } else if (e.target.classList.contains('close-task-tile-button')) {
        const modalOverlay = document.querySelector('.modal-overlay');
        document.body.removeChild(modalOverlay);
    }
}

/**
 * Handles clicking the add button to create a task/project.
 */
function handleAdd() {
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

/**
 * Handles form submission for a new task/project.
 * 
 * @param {Event} e is the event where form submission occurred.
 */
function handleFormSubmit(e) {
    e.preventDefault();
    if (e.target.classList.contains('task-form')) {
        if (projectList.length === 0) {
            alert('Create a new project first!');
            const modalOverlay = document.querySelector('.modal-overlay');
            document.body.removeChild(modalOverlay);
            return;
        }
        const activeProject = projectList.find(project => project.active);
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
        updateLocalStorage();
    } else if (e.target.classList.contains('project-form')) {
        const newProject = new Project('temp');
        if (projectList.length === 0) {
            newProject.active = true;
        }
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
        updateLocalStorage();
    }
    
}