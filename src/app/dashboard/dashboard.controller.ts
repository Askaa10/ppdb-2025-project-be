import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Body, Patch } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { Pendaftar } from '../pendaftaran/pendaftar.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getDashboardSummary() {
    return this.dashboardService.getDashboard();
  }

 @Get('daftar-siswa')
  async getDaftarSiswa() {
    return this.dashboardService.getDaftarSiswa();
  }


}
 
