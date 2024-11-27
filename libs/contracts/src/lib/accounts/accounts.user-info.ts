import { IUser } from '@libs/interfaces';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export namespace AccountUserInfo {
    export const topic = 'account.user-info.query';

    export class Request {
        @IsString()
        id!: Types.ObjectId;
    }

    export class Response {
        user!: Omit<IUser, 'passwordHash'>;
    }
}
