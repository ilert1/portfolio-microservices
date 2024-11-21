import { Types } from 'mongoose';
export enum UserRole {
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export interface IUser {
  _id?: unknown;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}
