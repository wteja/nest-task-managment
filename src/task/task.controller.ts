import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import CreateTaskDto from "./dto/create-task";
import UpdateTaskStatusDto from "./dto/update-task-status";
import Task from "./task.model";
import TaskService from "./task.service";

@Controller("/tasks")
export default class TaskController {
    constructor(private taskService: TaskService) { }

    @Get()
    getAllTasks(): Task[] {
        return this.taskService.getAllTasks();
    }

    @Get(":id")
    getTaskById(@Param("id") id: string): Task {
        return this.taskService.getTaskById(id);
    }

    @Post()
    createTask(@Body() { title, description }: CreateTaskDto) {
        return this.taskService.createTask(title, description);
    }

    @Put(":id")
    updateTaskStatus(@Param("id") id: string, @Body() { status }: UpdateTaskStatusDto): Task {
        return this.taskService.updateTaskStatus(id, status);
    }

    @Delete(":id")
    deleteTask(@Param("id") id): void {
        this.taskService.deleteTask(id);
    }
}