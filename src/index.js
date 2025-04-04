// index.js (entry point)

import "./styles.css";
import { Task } from "./includes/task.js";
import { Project } from "./includes/project.js";
import { renderContent, renderSidebar, handleTaskButton } from "./includes/domManipulator.js";

// Initialize default project for user
const defaultProject = new Project("default");
const testProj = new Project("test");
defaultProject.toggleActive();


let projectList = [defaultProject, testProj];
let currentProject = defaultProject;

const sampleTask = new Task(
    "Finish exam prep",
    "Finish prep for CS 101 and MATH 100.",
    new Date(2025, 4, 20),
    "High",
    "Some additional notes",
    defaultProject.id
);

const sampleTask2 = new Task(
    "Go workout",
    "Hit full body day.",
    new Date(2026, 6, 22),
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
    ,
    defaultProject.id
);
sampleTask2.toggleCompleted();

defaultProject.addTask(sampleTask);
defaultProject.addTask(sampleTask2);

// defaultProject.tasks.forEach ((task) => {
//     console.log("--JSON--");
//     console.log(task.toJson());
//     console.log("--TO-OBJECT--");
//     console.log(Task.fromJson(task.toJson()));
// });

renderSidebar(projectList, currentProject);
renderContent(defaultProject);


console.log(projectList[0].active);
