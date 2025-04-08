// project.js
import { Task } from './task';

// tasks is an array = {task1, task2, ...};
export class Project {
    constructor(name, tasks = [], active = false) {
        this.name = name;
        this.tasks = tasks;
        this.id = crypto.randomUUID();
        this.active = false;
    }

    // Adds a task to the array
    addTask(task) {
        this.tasks.push(task);
    }

    // Toggles active status
    toggleActive() {
        this.active = !this.active;
    }

    // Removes task by id
    removeTask(id) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }

    // Sort tasks in a specific method and return sorted tasks array
    getSortedTasks(method = 'created') {
        const priorityToInt = (task) => { 
            if (task.priority.toLowerCase() === 'high') {
                return 0;
            } else if (task.priority.toLowerCase() === 'medium') {
                return 1;
            } else {
                return 2;
            }
        };

        const tasksCopy = this.tasks.slice();
        if (method === 'created') {
            return this.tasks;
        } else if (method === 'priority') {
            tasksCopy.sort((t1, t2) => {
                return priorityToInt(t1) - priorityToInt(t2);
            });
        } else {
            tasksCopy.sort((t1, t2) => {
                return t1.dueDate - t2.dueDate;
            });
        }
        return tasksCopy;
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        const raw = JSON.parse(json);
        const proj = new Project('temp');
        proj.name = raw.name;
        proj.id = raw.id;
        proj.active = raw.active;
        const taskList = [];
        raw.tasks.forEach(task => {
            taskList.push(Task.fromJson(task));
        });
        proj.tasks = taskList;
        return proj;
    }
}