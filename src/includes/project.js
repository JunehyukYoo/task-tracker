// project.js

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

    toggleActive() {
        this.active = !this.active;
    }

}