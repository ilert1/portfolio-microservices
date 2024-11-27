import { Body, Controller } from '@nestjs/common';
import { AccountLogin, AccountRegister, AccountUserCourses, AccountUserInfo } from '@portfolio-microservices/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller('user')
export class UserCommands {
    constructor() {}
}
