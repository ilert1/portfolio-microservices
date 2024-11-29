import { IUser, IUserCourses, PurchaseState, UserRole } from '@libs/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';
import { Types } from 'mongoose';

export class UserEntity implements IUser {
    _id?: string;
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    courses: IUserCourses[];

    constructor(user: IUser) {
        this._id = user._id;
        this.passwordHash = user.passwordHash;
        this.displayName = user.displayName;
        this.email = user.email;
        this.role = user.role;
        this.courses = user.courses;
    }

    public addCourse(courseId: string) {
        const exist = this.courses.find(c => courseId === c._id);

        if (exist) {
            throw new Error('This course is already exists');
        }
        this.courses.push({
            courseId: courseId,
            purchaseState: PurchaseState.STARTED
        });
    }

    public deleteCourse(courseId: string) {
        this.courses = this.courses.filter(c => c._id !== courseId);
    }

    public updateCourseStatus(courseId: string, state: PurchaseState) {
        this.courses = this.courses.map(c => {
            if (c._id === courseId) {
                c.purchaseState = state;
                return c;
            }
            return c;
        });
    }

    public async setPassword(password: string) {
        const salt = await genSalt(10);
        this.passwordHash = await hash(password, salt);
        return this;
    }

    public async validatePassword(password: string) {
        return compare(password, this.passwordHash);
    }

    public updateProfile(displayName: string) {
        this.displayName = displayName;
        return this;
    }
}
