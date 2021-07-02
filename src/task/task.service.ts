import { Injectable, NotFoundException } from '@nestjs/common';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from 'src/entities/task.entity';
import { TaskStatus } from './task-status.enum';
import CreateTaskDto from './dto/create-task.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  /**
   * Get task by ID
   * @param id Task ID
   * @returns Task that requeste by ID
   */
  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) throw new NotFoundException('Task ID is not found.');

    return found;
  }

  /**
   * Create new task.
   * @param createTaskDto Create Task DTO
   * @returns Created task
   */
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
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
    await this.taskRepository.remove(found);
  }
}
