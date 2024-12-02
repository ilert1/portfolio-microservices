import { IUser } from '@libs/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { BuyCourseSaga } from './sagas/buy-course.saga';
import { UserEventEmitter } from './user.event-emitter';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly rmqService: RMQService,
        private readonly userEventEmitter: UserEventEmitter
    ) {}

    async changeProfile(user: Pick<IUser, 'displayName'>, id: string) {
        const oldUser = await this.userRepository.findUserByID(id);

        if (!oldUser) {
            throw new NotFoundException('There is no user with this credentials');
        }

        const userEntity = new UserEntity(oldUser).updateProfile(user.displayName);
        await this.updateUser(userEntity);

        return {};
    }

    async buyCourse(courseId: string, userId: string) {
        const oldUser = await this.userRepository.findUserByID(userId);

        if (!oldUser) {
            throw new NotFoundException('There is no user with this credentials');
        }

        const userEntity = new UserEntity(oldUser);
        const saga = new BuyCourseSaga(userEntity, userId, this.rmqService);
        const { user, paymentLink } = await saga.getState().pay();
        await this.updateUser(user);

        return { paymentLink };
    }

    async checkPayment(courseId: string, userId: string) {
        const oldUser = await this.userRepository.findUserByID(userId);

        if (!oldUser) {
            throw new NotFoundException('There is no user with this credentials');
        }

        const userEntity = new UserEntity(oldUser);
        const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
        const { status, user } = await saga.getState().checkPayment();

        await this.updateUser(user);

        return { status };
    }

    private async updateUser(user: UserEntity) {
        return Promise.all([this.userEventEmitter.handle(user), this.userRepository.updateProfile(user)]);
    }
}
