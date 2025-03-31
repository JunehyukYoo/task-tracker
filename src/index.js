// index.js (entry point)

import "./styles.css";
import { Task } from "./includes/task.js";
import { Project } from "./includes/project.js";
import { renderContent, renderSidebar } from "./includes/domManipulator.js";

// Initialize default project for user
const defaultProject = new Project("default");
const testProj = new Project("test");
defaultProject.toggleActive();
let projectList = [defaultProject, testProj];

const sampleTask = new Task(
    "Sample Task",
    "This is a sample task description",
    new Date(),
    "High",
    "Some additional notes",
    defaultProject.id
);

defaultProject.addTask(sampleTask);

// defaultProject.tasks.forEach ((task) => {
//     console.log("--JSON--");
//     console.log(task.toJson());
//     console.log("--TO-OBJECT--");
//     console.log(Task.fromJson(task.toJson()));
// });

renderSidebar(projectList);
renderContent(defaultProject);


console.log(projectList[0].active);
