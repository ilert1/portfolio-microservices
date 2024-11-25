import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export function getJwtConfig(): JwtModuleAsyncOptions {
    return {
        useFactory: (configService: ConfigService) => {
            return {
                secret: configService.get('JWT_SECRET')
            };
        },
        imports: [ConfigModule],
        inject: [ConfigService]
    };
}
