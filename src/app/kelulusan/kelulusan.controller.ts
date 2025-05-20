import { Controller, Get, Query } from '@nestjs/common';
import { CekKelulusanService } from './kelulusan.service';

@Controller('cek-kelulusan')
export class CekKelulusanController {
  constructor(private readonly service: CekKelulusanService) {}

  @Get('')
  async cekLulus(
    @Query('nis') nis: string,
    @Query('nisn') nisn: string,
    @Query('nik') nik: string,
  ) {
    return this.service.cekKelulusan(nis, nisn, nik);
  }
}