import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Task } from 'src/entities/task.entity';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import TaskStatusValidationPipe from './pipes/task-status-validation-pipe';
import { TaskStatus } from './task-status.enum';
import { TaskService } from './task.service';

@Controller('/tasks')
@UseGuards(AuthGuard())
export default class TaskController {
  private logger = new Logger('TaskController');
  constructor(private taskService: TaskService) { }

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    this.logger.verbose(`User ${user.username} retrieved all tasks. Filters: ${JSON.stringify(filterDto)}`);
    return this.taskService.getTasks(filterDto, user);
  }

  @Get(':id')
  getTaskById(@Param('id') id: number, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ) {
    this.logger.verbose(`User ${user.username} create a task. Data: ${JSON.stringify(createTaskDto)}`);
    return this.taskService.createTask(createTaskDto, user);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User
  ): Promise<Task> {
    this.logger.verbose(`User ${user.username} update task status. TaskID: ${id}, Status: ${status}`);
    return this.taskService.updateTaskStatus(id, status, user);
  }

  @Delete(':id')
  deleteTask(
    @Param('id') id: number,
    @GetUser() user: User): void {
      this.logger.verbose(`User ${user.username} delete task. TaskID: ${id}`);
    this.taskService.deleteTask(id, user);
  }
}
