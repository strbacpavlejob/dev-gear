import { Module } from '@nestjs/common';
import { StripesService } from './stripes.service';
import { StripesController } from './stripes.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [StripesController],
  providers: [StripesService],
  exports: [StripesService],
})
export class StripesModule {}
