import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountLogin, AccountRegister } from '@portfolio-microservices/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @RMQValidate()
    @RMQRoute(AccountLogin.topic)
    async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {
        return this.authService.register(dto);
    }

    @RMQValidate()
    @RMQRoute(AccountRegister.topic)
    async login(@Body() dto: AccountLogin.Request): Promise<AccountLogin.Response> {
        const { id } = await this.authService.validateUser(dto.email, dto.password);
        return this.authService.login(id);
    }
}
