import { Injectable, NotFoundException } from "@nestjs/common";
import GetTasksFilterDto from "./dto/get-tasks-filter.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskRepository } from "./task.repository";
import { Task } from "src/entities/task.entity";
import { TaskStatus } from "./task-status.enum";
import { Like } from "typeorm";

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }
    /**
     * List all tasks
     */
    getAllTasks(): Promise<Task[]> {
        return this.taskRepository.find();
    }

    getTasksWithFilter(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { search, status } = filterDto;
        let where = [];
        if(search) {
            const s = search.trim();
            where.push({ title: Like(`%${s}%`) })
            where.push({ description: Like(`%${s}%`) })
        }
        if(status) {
            where.push({status});
        }
        return this.taskRepository.find({ where });
    }

    /**
     * Get task by ID
     * @param id Task ID
     * @returns Task that requeste by ID
     */
    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id)
        if (!found)
            throw new NotFoundException("Task ID is not found.")

        return found;
    }

    /**
     * Create new task.
     * @param title Task title
     * @param description Task description
     * @returns Created task
     */
    async createTask(title: string, description: string): Promise<Task> {
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();
        return task
    }

    /**
     * Update Task Status.
     * @param id Task ID
     * @param status Task Status
     * @returns Updated task
     */
    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        task.save();
        return task;
    }

    /**
     * Delete task by ID.
     * @param id Task ID
     */
    async deleteTask(id: number): Promise<void> {
        const found = await this.getTaskById(id);
        await this.taskRepository.remove(found)
    }
}