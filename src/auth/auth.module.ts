import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthConfig } from './config/auth.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    CacheModule.register(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthConfig, JwtStrategy],
  exports:[AuthService]
})
export class AuthModule { }
