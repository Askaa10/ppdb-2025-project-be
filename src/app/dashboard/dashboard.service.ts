import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pendaftar } from '../pendaftaran/pendaftar.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Pendaftar)
    private readonly pendaftarRepo: Repository<Pendaftar>,
  ) {}

  async getDashboard(): Promise<any> {
    const [totalPendaftar, totalVerifikasi, totalBelumUpload, totalWawancaraHariIni, totalJenisKelamin] = await Promise.all([
      this.pendaftarRepo.count(),
      this.pendaftarRepo.count({ where: { sudahVerifikasi: false } }),
      this.pendaftarRepo.count({ where: { uploadBerkas: false } }),
      this.pendaftarRepo.count({ where: { sudahWawancara: false } }),
      this.pendaftarRepo.createQueryBuilder('pendaftar')
        .select('COUNT(*) AS total, jenisKelamin')
        .groupBy('jenisKelamin')
        .getRawMany(),
    ]);

    return {
      totalPendaftar,
      totalVerifikasi,
      totalBelumUpload,
      totalWawancaraHariIni,
      totalJenisKelamin,
    };
  }
  
}
