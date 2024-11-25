import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from '@libs/interfaces';
import { JwtService } from '@nestjs/jwt';
import { AccountRegister } from '@portfolio-microservices/contracts';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService) {}

    async register({ email, password, displayName }: AccountRegister.Request) {
        const oldUser = await this.userRepository.findUser(email);
        if (oldUser) {
            throw new Error('User with this email is alreay exists');
        }

        const newUserEntity = await new UserEntity({
            displayName,
            email,
            passwordHash: '',
            role: UserRole.STUDENT
        }).setPassword(password);

        const newUser = await this.userRepository.createUser(newUserEntity);
        return { email: newUser.email };
    }

    async validateUser(email: string, password: string) {
        const user = await this.userRepository.findUser(email);
        if (!user) {
            throw new Error('Wrong login or password');
        }

        const userEntity = new UserEntity(user);
        const isCorectPassword = userEntity.validatePassword(password);

        if (!isCorectPassword) {
            throw new Error('Wrong login or password');
        }
        return { id: user._id };
    }

    async login(id: unknown) {
        return {
            access_token: await this.jwtService.signAsync({ id })
        };
    }
}
