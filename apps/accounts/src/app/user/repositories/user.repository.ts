import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { AccountChangeProfile } from '@portfolio-microservices/contracts';

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async createUser(user: UserEntity) {
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    async findUser(email: string) {
        return this.userModel.findOne({ email }).exec();
    }

    async findUserByID(id: string) {
        return this.userModel.findById(id).lean();
    }

    async deleteUser(email: string) {
        return this.userModel.deleteOne({ email }).exec();
    }
    async updateProfile({ _id, ...rest }: UserEntity) {
        return this.userModel.updateOne({ _id }, { $set: { ...rest } }).exec();
    }
}
