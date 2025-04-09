// domCreator.js
import folderClosedIcon from "../asset/folder_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import folderOpenIcon from "../asset/folder_open_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import openInFullIcon from "../asset/open_in_full_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import closeTileIcon from '../asset/close_fullscreen_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';
import incompleteIcon from "../asset/toggle_on_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import completeIcon from "../asset/toggle_off_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import removeIcon from "../asset/delete_forever_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"
import closeIcon from "../asset/close_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import { format } from "date-fns";

// Creates project DOM element for sidebar div
export function createProjectItem(project) {
    const projectItem = document.createElement("div");

    const removeBtn = document.createElement('img');
    removeBtn.classList.add('remove-project-button');
    removeBtn.id = `rm-${project.id}`;
    removeBtn.src = removeIcon;

    const directory = document.createElement('div');
    directory.style = `
        display: flex;
        align-items: center;
        gap: 3px;
    `;
    
    const folderSpan = document.createElement('span');
    folderSpan.classList.add('material-symbols-outlined');
    //folderSpan.style = 'margin-right: 3px;';

    const folderTitle = document.createElement('p');
    folderTitle.textContent = project.name;

    const folderIcon = document.createElement('img');
    folderIcon.src = project.active ? folderOpenIcon : folderClosedIcon;

    folderSpan.appendChild(folderIcon);

    directory.appendChild(folderSpan);
    directory.appendChild(folderTitle);
    
    // directory.innerHTML = `
    //     <span class="material-symbols-outlined" style="margin-right: 3px">${iconHtml}</span>${project.name}`;
    
    projectItem.appendChild(directory);
    projectItem.appendChild(removeBtn);
    projectItem.classList.add("project-item");

    return projectItem;
}

// Creates a task DOM element for content div
export function createTaskItem(task, mode = 'list') {
    const taskItem = document.createElement("div");
    taskItem.classList.add(`task-${mode}`);
    if (mode === "list") {
        // Title: fixed width (20%), no shrinking
        const taskTitle = document.createElement("div");
        taskTitle.textContent = task.title;
        taskTitle.style = `
            flex: 0 0 20%; 
            min-width: 0; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            white-space: nowrap; 
            margin-left: 1rem; 
            color: #d0c632; 
            text-decoration: #d0c632 solid underline;`;

        // Description: flexible, will shrink until its min-width is reached
        const taskDesc = document.createElement("div");
        taskDesc.textContent = task.description;
        // Allow it to grow and shrink but not below 100px (adjust as needed)
        taskDesc.style = "flex: 1 1 auto; min-width: 10px; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";

        // Due Date: fixed width (15%), no shrinking
        const taskDueDate = document.createElement("div");
        taskDueDate.textContent = `Due: ${format(new Date(task.dueDate), "MMM dd, yyyy")}`;
        taskDueDate.style = "flex: 0 0 15%; min-width: 0;";

        // Priority: fixed width (15%), no shrinking
        const taskPriority = document.createElement("div");
        taskPriority.textContent = `Priority: ${task.priority}`;
        taskPriority.style = "flex: 0 0 15%; min-width: 0;";

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
        // Title element (centered)
        taskItem.classList.add('task-tile');
        const taskTitle = document.createElement("div");
        taskTitle.textContent = task.title;
        taskTitle.style = `
            font-weight: bold; 
            color: #d0c632; 
            text-decoration: #d0c632 solid underline;
            font-size: 1.5em; 
            margin-bottom: 0.5rem; 
            text-align: center;`;

        // Description element (with clamped lines)
        const taskDesc = document.createElement("div");
        taskDesc.textContent = task.description;
        taskDesc.style = `
            flex: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            text-align: center;
            margin-bottom: 0.5rem;
        `;

        // Info container for due date, priority, and status
        const infoContainer = document.createElement("div");
        infoContainer.style = "display: flex; flex-direction: column; align-items: center; gap: 0.25rem;";
        
        const taskDueDate = document.createElement("div");
        taskDueDate.textContent = `Due: ${format(new Date(task.dueDate), "MMM dd, yyyy")}`;
        taskDueDate.style = "font-size: 0.9em;";
        
        const taskPriority = document.createElement("div");
        taskPriority.textContent = `${task.priority} priority`;
        taskPriority.style = "font-size: 0.9em;";
        
        const taskStatus = document.createElement("div");
        taskStatus.textContent = task.completed ? "Complete" : "Incomplete";
        taskStatus.style = task.completed ? "font-size: 0.9em;" : "font-size: 0.9em; color: red;";
        
        infoContainer.appendChild(taskDueDate);
        infoContainer.appendChild(taskPriority);
        infoContainer.appendChild(taskStatus);

        // Create a notes textarea for user input
        const taskNotes = document.createElement("textarea");
        taskNotes.placeholder = "Add notes...";
        taskNotes.value = task.notes || "";
        taskNotes.style = `
            width: 100%;
            flex: 1;
            margin: 0.5rem 0;
            border-radius: 5px;
            padding: 0.5rem;
            resize: vertical;
            background-color: #444;
            color: #fff;
            border: 1px solid #666;
        `;
        // Save the notes to the task object when changed
        taskNotes.addEventListener("change", () => {
            task.notes = taskNotes.value;
        });
        
        // Button wrapper for action buttons
        const taskBtnWrapper = document.createElement("div");
        const toggleButton = task.completed ? completeIcon : incompleteIcon;
        taskBtnWrapper.innerHTML = `
            <img src="${toggleButton}" class="toggle-complete-button" id="toggle-${task.id}" style="cursor: pointer;">
            <img src="${closeTileIcon}" class="close-task-tile-button" id="open-${task.id}" style="cursor: pointer;">
            <img src="${removeIcon}" class="remove-task-button" id="remove-${task.id}" style="cursor: pointer;">
        `;
        taskBtnWrapper.style = "display: flex; justify-content: space-around; align-items: center; width: 100%;";

        // Assemble the tile using taskItem
        taskItem.appendChild(taskTitle);
        taskItem.appendChild(taskDesc);
        taskItem.appendChild(infoContainer);
        taskItem.appendChild(taskNotes);
        taskItem.appendChild(taskBtnWrapper);
    } else {
        throw new Error("Invalid task mode");
    }
    return taskItem;
}

// Creates toolBar Dom element for content div
export function createToolBar(project) {
    const toolBar = document.createElement("div");
    toolBar.classList.add("toolbar");

    const projName = document.createElement("div");
    projName.style = "font-size: 30px; height: 50px; margin-left: 1rem;";
    projName.textContent = `./${project.name}`;

    const toolsWrapper = document.createElement("div");
    const sortWrapper = document.createElement("div");
    
    const sortLabel = document.createElement("label");
    sortLabel.textContent = "Sort: ";
    const sortSelect = document.createElement("select");
    sortSelect.name = "sort";
    const sortMethods = ["Created", "Priority", "Due Date"];
    sortMethods.forEach(method => {
        const option = document.createElement("option");
        option.value = method.toLowerCase();
        option.textContent = method;
        sortSelect.appendChild(option);
    });
    sortSelect.style = `
        padding: 0.5rem;
        border: 1px solid #777;
        border-radius: 4px;
        background-color: #444;
        color: #fff;
    `;
    sortWrapper.appendChild(sortLabel);
    sortWrapper.appendChild(sortSelect);
    
    toolsWrapper.style = "display: flex; justify-content: center; align-items: flex-end; height: 30px;";
    toolsWrapper.appendChild(sortWrapper);

    toolBar.appendChild(projName);
    toolBar.appendChild(toolsWrapper);
    return toolBar;
}

// Create form selector DOM item
export function createFormSelectionItem() {
    const formSelector = document.createElement('div');
    formSelector.classList.add('form-selector');
    formSelector.classList.add('modal-content');

    const btnWrapper = document.createElement('div');
    btnWrapper.style = `
        display: flex;
        justify-content: space-around;
    `;
    const addTaskBtn = document.createElement('button');
    addTaskBtn.id = 'add-task';
    addTaskBtn.innerHTML = `Add <span class="button-span">Task</span>`;

    const addProjectBtn = document.createElement('button');
    addProjectBtn.id = 'add-project';
    addProjectBtn.innerHTML = `Add <span class="button-span">Project</span>`;

    const closeBtn = document.createElement('img');
    closeBtn.src = closeIcon;
    closeBtn.id = 'close-form-button';
    closeBtn.style = `
        position: relative;
        align-self: flex-end;
        width: 20px;
    `;

    btnWrapper.appendChild(addTaskBtn);
    btnWrapper.appendChild(addProjectBtn);
    formSelector.appendChild(closeBtn);
    formSelector.appendChild(btnWrapper);
    return formSelector;
}

// Creates a form for adding a new task
export function createTaskFormItem() {
    const form = document.createElement("form");
    form.classList.add("task-form");
    form.classList.add('modal-content');

    // Title Field
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Task Title:";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.placeholder = "Enter task title";
    titleInput.required = true;

    // Description Field
    const descLabel = document.createElement("label");
    descLabel.textContent = "Description:";
    const descTextarea = document.createElement("textarea");
    descTextarea.name = "description";
    descTextarea.style = 'resize: vertical';
    descTextarea.placeholder = "Enter task description";
    descTextarea.required = true;

    // Due Date Field
    const dueDateLabel = document.createElement("label");
    dueDateLabel.textContent = "Due Date:";
    const dueDateInput = document.createElement("input");
    dueDateInput.type = "date";
    dueDateInput.name = "dueDate";
    dueDateInput.required = true;

    // Priority Field
    const priorityLabel = document.createElement("label");
    priorityLabel.textContent = "Priority:";
    const prioritySelect = document.createElement("select");
    prioritySelect.name = "priority";
    const priorities = ["LOW", "MEDIUM", "HIGH"];
    priorities.forEach(p => {
        const option = document.createElement("option");
        option.value = p.toLowerCase();
        option.textContent = p;
        prioritySelect.appendChild(option);
    });

    // Notes Field
    const notesLabel = document.createElement("label");
    notesLabel.textContent = "Notes:";
    const notesTextarea = document.createElement("textarea");
    notesTextarea.name = "notes";
    notesTextarea.placeholder = "Additional notes...";
    notesTextarea.style = 'resize: vertical';

    // Submit Button
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "+";
    submitBtn.style = 'width: 100%;';

    // Close form button
    const closeBtn = document.createElement('img');
    closeBtn.src = closeIcon;
    closeBtn.id = 'close-form-button';
    closeBtn.style = `
        position: relative;
        align-self: flex-end;
        width: 20px;
    `;

    // Append fields to the form
    form.appendChild(closeBtn);
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(descLabel);
    form.appendChild(descTextarea);
    form.appendChild(dueDateLabel);
    form.appendChild(dueDateInput);
    form.appendChild(priorityLabel);
    form.appendChild(prioritySelect);
    form.appendChild(notesLabel);
    form.appendChild(notesTextarea);
    form.appendChild(submitBtn);

    // Style form inputs for consistency
    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach(input => {
        input.style = `
            padding: 0.5rem;
            border: 1px solid #777;
            border-radius: 4px;
            background-color: #444;
            color: #fff;
        `;
    });

    return form;
}

// Creates a form for adding a new project
export function createProjectFormItem() {
    const form = document.createElement("form");
    form.classList.add("project-form");
    form.classList.add('modal-content');

    // Title Field
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Project Title:";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "name";
    titleInput.placeholder = "Enter project title";
    titleInput.required = true;

    // Submit Button
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "+";
    submitBtn.style = 'width: 100%;';

    // Close form button
    const closeBtn = document.createElement('img');
    closeBtn.src = closeIcon;
    closeBtn.id = 'close-form-button';
    closeBtn.style = `
        position: relative;
        align-self: flex-end;
        width: 20px;
    `;

    // Append fields to the form
    form.appendChild(closeBtn);
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(submitBtn);

    // Style form inputs for consistency
    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach(input => {
        input.style = `
            padding: 0.5rem;
            border: 1px solid #777;
            border-radius: 4px;
            background-color: #444;
            color: #fff;
        `;
    });

    return form;
}
