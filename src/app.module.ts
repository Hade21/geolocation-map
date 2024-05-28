import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UnitsModule } from './units/units.module';

@Module({
  imports: [CommonModule, UnitsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
