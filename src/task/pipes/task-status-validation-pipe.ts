import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export default class TaskStatusValidationPipe implements PipeTransform {
    private allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ]
    transform(value: string) {
        value = value.toUpperCase();
        if(!this.isStatusValid(value)) {
            throw new BadRequestException("Value has invalid status.");
        }
        return value;
    }

    private isStatusValid(value) {
        return this.allowedStatuses.indexOf(value) > -1;
    }
}