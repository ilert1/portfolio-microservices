import { Body, Controller } from '@nestjs/common';
import { AccountLogin, AccountRegister, AccountUserCourses, AccountUserInfo } from '@portfolio-microservices/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';

@Controller('user')
export class UserQueries {
    constructor(private readonly userRepository: UserRepository) {}

    @RMQValidate()
    @RMQRoute(AccountUserInfo.topic)
    async userInfo(@Body() { id }: AccountUserInfo.Request): Promise<AccountUserInfo.Response> {
        const user = await this.userRepository.findUserByID(id);

        if (!user) {
            throw new Error('User not found');
        }

        const { passwordHash, ...safeUser } = user.toObject();

        return {
            user: safeUser
        };
    }

    @RMQValidate()
    @RMQRoute(AccountUserCourses.topic)
    async userIfno(@Body() { id }: AccountUserCourses.Request): Promise<AccountUserCourses.Response> {
        const user = await this.userRepository.findUserByID(id);

        if (!user) {
            throw new Error('User not found');
        }

        const { courses, ...rest } = user.toObject();

        return {
            courses
        };
    }
}
