import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

@Module({
  imports: [UsersModule],
  providers: [UnitsService],
  controllers: [UnitsController],
})
export class UnitsModule {}
