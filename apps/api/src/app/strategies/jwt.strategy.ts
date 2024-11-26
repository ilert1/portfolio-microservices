import { IJwtPayload } from '@libs/interfaces';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configSerivce: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
            ignoreExpire: true,
            secretOrKey: configSerivce.get('JWT_SECRET')
        });
    }

    async validate({ id }: IJwtPayload) {
        return id;
    }
}
