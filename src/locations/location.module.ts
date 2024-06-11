import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [UsersModule],
  providers: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}
