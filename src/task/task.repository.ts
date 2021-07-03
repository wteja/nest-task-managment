import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { Task } from 'src/entities/task.entity';
import { EntityRepository, Repository } from 'typeorm';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger();

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { search, status } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      const s = search.trim();
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${s}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`, error.stacks);
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
      delete task.user;
      return task;
    } catch (error) {
      this.logger.error(`Failed to create a task for user "${user.username}". Data: ${JSON.stringify(createTaskDto)}`, error.stacks);
      throw new InternalServerErrorException();
    }
  }
}
