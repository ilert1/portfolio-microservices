import { Body, Controller } from '@nestjs/common';
import { AccountBuyCourse, AccountChangeProfile, AccountCheckPayment } from '@portfolio-microservices/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserService } from './user.service';

@Controller('user')
export class UserCommands {
    constructor(private readonly userService: UserService) {}

    @RMQValidate()
    @RMQRoute(AccountChangeProfile.topic)
    async changeProfile(@Body() { user, id }: AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
        return this.userService.changeProfile(user, id);
    }

    @RMQValidate()
    @RMQRoute(AccountBuyCourse.topic)
    async buyCourse(@Body() { courseId, userId }: AccountBuyCourse.Request): Promise<AccountBuyCourse.Response> {
        return this.userService.buyCourse(courseId, userId);
    }

    @RMQValidate()
    @RMQRoute(AccountCheckPayment.topic)
    async checkPayment(
        @Body() { courseId, userId }: AccountCheckPayment.Request
    ): Promise<AccountCheckPayment.Response> {
        return this.userService.checkPayment(courseId, userId);
    }
}
