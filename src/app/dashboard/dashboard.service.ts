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
    const dateString = `${yyyy}-${mm}-${dd}`;

    const [
      totalPendaftar,
      totalVerifikasi,
      totalBelumUpload,
      totalJenisKelamin,
      rawKelulusan,
    ] = await Promise.all([
      this.pendaftarRepo.count(),
      this.pendaftarRepo.count({ where: { sudahVerifikasi: true } }),
      this.pendaftarRepo.count({ where: { uploadBerkas: false } }),
      this.pendaftarRepo.createQueryBuilder('pendaftar')
        .select('pendaftar.jenisKelamin', 'jenisKelamin')
        .addSelect('COUNT(*)', 'total')
        .groupBy('pendaftar.jenisKelamin')
        .getRawMany(),
      this.pendaftarRepo.createQueryBuilder('pendaftar')
        .select('pendaftar.statusKelulusan', 'statusKelulusan')
        .addSelect('COUNT(*)', 'total')
        .groupBy('pendaftar.statusKelulusan')
        .getRawMany(),
    ]);

    const totalKelulusan = {
      lulus: 0,
      tidakLulus: 0,
      ditunda: 0,
    };

    for (const row of rawKelulusan) {
      const status = row.statusKelulusan?.toLowerCase(); // normalize lowercase
      const count = Number(row.total);

      switch (status) {
        case 'lulus':
          totalKelulusan.lulus = count;
          break;
        case 'tidak lulus':
          totalKelulusan.tidakLulus = count;
          break;
        case 'ditunda':
        case null:
        case undefined:
        default:
          totalKelulusan.ditunda += count;
          break;
      }
    }

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
      statusKelulusan: totalKelulusan,
    };
  }

  async getDaftarSiswa(): Promise<any> {
    const [data, total] = await this.pendaftarRepo.findAndCount({
      select: [
        'id',
        'nama',
        'statusKelulusan',
        'jenisKelamin',
        'sudahWawancara',
        'sudahVerifikasi',
        'uploadBerkas',
        'nilai'
      ],
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
    };
  }
  }

