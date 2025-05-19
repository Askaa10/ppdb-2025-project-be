import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Pendaftar } from '../pendaftaran/pendaftar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pendaftar])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}