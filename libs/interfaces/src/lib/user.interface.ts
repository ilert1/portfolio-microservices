import { Types } from 'mongoose';
export enum UserRole {
    TEACHER = 'teacher',
    STUDENT = 'student'
}

export enum PurchaseState {
    STARTED = 'Started',
    WAITING_FOR_PAYMENT = 'Waiting for payment',
    PURCHASED = 'Purchased',
    CANCELLED = 'Cancelled'
}

export interface IUser {
    _id?: Types.ObjectId;
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    courses: IUserCourses[];
}

export interface IUserCourses {
    _id?: Types.ObjectId;
    courseId: Types.ObjectId;
    purchaseState: PurchaseState;
}
