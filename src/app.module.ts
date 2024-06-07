import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { LocationModule } from './locations/location.module';
import { UnitsModule } from './units/units.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CommonModule, UnitsModule, LocationModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
