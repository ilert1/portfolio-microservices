import { IUser, IUserCourses, PurchaseState, UserRole } from '@libs/interfaces';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export namespace AccountChangeProfile {
    export const topic = 'account.change-profile.command';

    export class Request {
        @IsString()
        id!: string;

        @IsOptional()
        @IsString()
        user!: Pick<IUser, 'displayName'>;
    }

    export class Response {}
}
