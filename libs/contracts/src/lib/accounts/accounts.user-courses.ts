import { IUserCourses } from '@libs/interfaces';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export namespace AccountUserCourses {
    export const topic = 'account.user-courses.query';

    export class Request {
        @IsString()
        id!: Types.ObjectId;
    }

    export class Response {
        courses!: IUserCourses[];
    }
}
