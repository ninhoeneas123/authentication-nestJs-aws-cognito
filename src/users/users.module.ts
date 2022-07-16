import { AuthConfig } from './../auth/config/auth.config';
import { CacheModule, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordIsValidConstraint } from 'src/utils/pipes/password-validation.validator';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { HashPassword } from 'src/utils/hash-password';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CacheModule.register(),
  ],
  controllers: [UsersController],
  providers: [UsersService, PasswordIsValidConstraint, AuthService, AuthConfig, HashPassword, JwtStrategy]
})
export class UsersModule { }
