// project.js

// tasks is an array = {task1, task2, ...};
export class Project {
    constructor(name, tasks = []) {
        this.name = name;
        this.tasks = tasks;
        this.id = crypto.randomUUID();
    }

    // Adds a task to the array
    addTask(task) {
        this.tasks.push(task);
    }
}