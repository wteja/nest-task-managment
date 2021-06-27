import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { Task } from "src/entities/task.entity";
import CreateTaskDto from "./dto/create-task.dto";
import GetTasksFilterDto from "./dto/get-tasks-filter.dto";
import TaskStatusValidationPipe from "./pipes/task-status-validation-pipe";
import { TaskStatus } from "./task-status.enum";
import { TaskService } from "./task.service";

@Controller("/tasks")
export default class TaskController {
    constructor(private taskService: TaskService) { }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskService.getTasks(filterDto);
    }

    @Get(":id")
    getTaskById(@Param("id") id: number): Promise<Task> {
        return this.taskService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto) {
        return this.taskService.createTask(createTaskDto);
    }

    @Patch(":id/status")
    updateTaskStatus(@Param("id") id: number, @Body("status", TaskStatusValidationPipe) status: TaskStatus): Promise<Task> {
        return this.taskService.updateTaskStatus(id, status);
    }

    @Delete(":id")
    deleteTask(@Param("id") id: number): void {
        this.taskService.deleteTask(id);
    }
}