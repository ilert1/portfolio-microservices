import { IUserCourses } from '@libs/interfaces';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export namespace AccountBuyCourse {
    export const topic = 'account.buy-course.command';

    export class Request {
        @IsString()
        userId!: string;

        @IsString()
        courseId!: string;
    }

    export class Response {
        paymentLink!: string;
    }
}
