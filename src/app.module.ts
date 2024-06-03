import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { LocationModule } from './locations/location.module';
import { UnitsModule } from './units/units.module';

@Module({
  imports: [CommonModule, UnitsModule, LocationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
