// task.js
// Each task has a title, description, dueDate, priority, notes
export class Task {
    constructor(title, project, description = "", dueDate = "", priority = "", notes = "") {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority.toUpperCase();
        this.notes = notes;
        this.project = project;
        this.completed = false;
        this.id = crypto.randomUUID();
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        const raw = JSON.parse(json);
        return new Task(raw.title, raw.description, new Date(raw.dueDate), raw.priority, raw.notes, raw.project);
    }
}