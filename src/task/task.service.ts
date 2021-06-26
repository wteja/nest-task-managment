import { Injectable, NotFoundException } from "@nestjs/common";
import Task, { TaskStatus } from "./task.model";
import {v4 as uuid} from "uuid";
import GetTasksFilterDto from "./dto/get-tasks-filter.dto";

@Injectable()
export default class TaskService {
    private tasks: Task[] = [];

    /**
     * List all tasks
     */
    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
        const { search, status } = filterDto;
        let tasks = this.getAllTasks();
        if(search) {
            const s = search.trim();
            tasks = tasks.filter(t => t.title.includes(s) || t.description.includes(s));
        }
        if(status) {
            tasks = tasks.filter(t => t.status === status);
        }
        return tasks;
    }

    /**
     * Get task by ID
     * @param id Task ID
     * @returns Task that requeste by ID
     */
    getTaskById(id: string): Task {
        const found =  this.tasks.find(t => t.id === id);
        if(!found)
            throw new NotFoundException("Task ID is not found.")

        return found;
    }

    /**
     * Create new task.
     * @param title Task title
     * @param description Task description
     * @returns Created task
     */
    createTask(title: string, description: string): Task {
        const task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        };
        this.tasks.push(task);
        return task;
    }

    /**
     * Update Task Status.
     * @param id Task ID
     * @param status Task Status
     * @returns Updated task
     */
    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        if(task) {
            task.status = status;
        }
        return task;
    }

    /**
     * Delete task by ID.
     * @param id Task ID
     */
    deleteTask(id): void {
        this.tasks = this.tasks.filter(t => t.id !== id);
    }
}