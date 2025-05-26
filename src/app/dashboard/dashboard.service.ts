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
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateString = `${yyyy}-${mm}-${dd}`; // format YYYY-MM-DD

    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [
      totalPendaftar,
      totalVerifikasi,
      totalBelumUpload,
      totalJenisKelamin,
    ] = await Promise.all([
      // Total semua pendaftar
      this.pendaftarRepo.count(),

      // Total pendaftar yang sudah verifikasi
      this.pendaftarRepo.count({ where: { sudahVerifikasi: true } }),

      // Total pendaftar yang belum upload berkas
      this.pendaftarRepo.count({ where: { uploadBerkas: false } }),

      // Statistik jenis kelamin
      this.pendaftarRepo.createQueryBuilder('pendaftar')
        .select('pendaftar.jenisKelamin', 'jenisKelamin')
        .addSelect('COUNT(*)', 'total')
        .groupBy('pendaftar.jenisKelamin')
        .getRawMany(),
    ]);

    const totalWawancaraHariIni = await this.pendaftarRepo.createQueryBuilder('pendaftar')
      .where('pendaftar.sudahWawancara = :status', { status: true })
      .andWhere('DATE(pendaftar.createdAt) = :today', { today: dateString })
      .getCount();

    return {
      totalPendaftar,
      totalVerifikasi,
      totalBelumUpload,
      totalWawancaraHariIni,
      totalJenisKelamin,
    };
  }
}
