import { TaskEntity } from "src/entities/task.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {

}