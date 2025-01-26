import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MailService } from '../mail/mail.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [CloudinaryModule],
  providers: [UsersService, MailService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
