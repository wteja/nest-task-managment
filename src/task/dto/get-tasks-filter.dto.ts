import { TaskStatus } from "../task.model";

export default class GetTasksFilterDto {
    search: string;
    status: TaskStatus;
}