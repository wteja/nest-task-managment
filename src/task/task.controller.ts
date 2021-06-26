import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import CreateTaskDto from "./dto/create-task.dto";
import GetTasksFilterDto from "./dto/get-tasks-filter.dto";
import UpdateTaskStatusDto from "./dto/update-task-status.dto";
import TaskStatusValidationPipe from "./pipes/task-status-validation-pipe";
import Task, { TaskStatus } from "./task.model";
import TaskService from "./task.service";

@Controller("/tasks")
export default class TaskController {
    constructor(private taskService: TaskService) { }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
        if(Object.keys(filterDto)) {
            return this.taskService.getTasksWithFilter(filterDto);
        } else {
            return this.taskService.getAllTasks();
        }
    }

    @Get(":id")
    getTaskById(@Param("id") id: string): Task {
        return this.taskService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() { title, description }: CreateTaskDto) {
        return this.taskService.createTask(title, description);
    }

    @Patch(":id/status")
    updateTaskStatus(@Param("id") id: string, @Body("status", TaskStatusValidationPipe) status: TaskStatus): Task {
        return this.taskService.updateTaskStatus(id, status);
    }

    @Delete(":id")
    deleteTask(@Param("id") id): void {
        this.taskService.deleteTask(id);
    }
}