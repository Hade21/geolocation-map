import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RefreshJwtAuthGuard } from './guard/refresh-jwt-auth.guard';
import { JwtStrategy } from './strategy/jwt-strategy';
import { LocalStrategy } from './strategy/local-strategy';
import { RefreshJwtStrategy } from './strategy/refreshToken-strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
    CloudinaryModule,
  ],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    LocalStrategy,
    JwtAuthGuard,
    RefreshJwtStrategy,
    RefreshJwtAuthGuard,
    MailService,
  ],
  controllers: [AuthController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
