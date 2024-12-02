import { IsNumber, IsString } from 'class-validator';

export type PaymmentStatus = 'CANCELLED' | 'SUCCESS' | 'PROGRESS';

export namespace PaymentCheck {
    export const topic = 'payment.check.query';

    export class Request {
        @IsString()
        courseId!: string;

        @IsString()
        userId!: string;
    }

    export class Response {
        status!: PaymmentStatus;
    }
}
