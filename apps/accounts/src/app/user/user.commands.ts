import { Body, Controller, NotFoundException } from '@nestjs/common';
import { AccountChangeProfile } from '@portfolio-microservices/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

@Controller('user')
export class UserCommands {
    constructor(private readonly userRepository: UserRepository) {}

    @RMQValidate()
    @RMQRoute(AccountChangeProfile.topic)
    async userInfo(@Body() { user, id }: AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
        const oldUser = await this.userRepository.findUserByID(id);

        if (!oldUser) {
            throw new NotFoundException('There is no user with this credentials');
        }

        const userEntity = new UserEntity(oldUser).updateProfile(user.displayName);

        await this.userRepository.updateProfile(userEntity);
        return {};
    }
}
