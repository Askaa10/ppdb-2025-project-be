import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pendaftar } from '../pendaftaran/pendaftar.entity';
import { CekKelulusanService } from './kelulusan.service';

@Controller('cek-kelulusan')
export class CekKelulusanController {
  constructor(
    private readonly service: CekKelulusanService,
    @InjectRepository(Pendaftar)
    private readonly pendaftarRepo: Repository<Pendaftar>,
  ) {}

  @Get('perId')
  async cekLulus(@Query('id') id: string) {
    const pendaftar = await this.pendaftarRepo.findOne({ where: { id } });
    if (!pendaftar) throw new NotFoundException('Pendaftar tidak ditemukan');

    if (pendaftar.statusTest === 'sudah test') {
      const nilai = pendaftar.nilai || 0;
      if (nilai < 75) {
        return {
          ...pendaftar,
          statusTest: 'sudah test',
          statusKelulusan: 'Tidak Lulus',
          message: 'Nilai di bawah 75, tidak lulus.',
        };
      }

      // Cek verifikasi, wawancara, upload berkas
      if (
        !pendaftar.sudahVerifikasi ||
        !pendaftar.sudahWawancara ||
        !pendaftar.uploadBerkas
      ) {
        return {
          ...pendaftar,
          statusTest: 'sudah test',
          statusKelulusan: 'Ditunda',
          message:
            'Kelulusan ditunda, lengkapi verifikasi, wawancara, dan upload berkas.',
        };
      }

      return {
        ...pendaftar,
        statusTest: 'sudah test',
        statusKelulusan: 'Lulus',
        message: 'Selamat, Anda lulus!',
      };
    }

    return {
      ...pendaftar,
      nilai: null,
      statusKelulusan: null,
      message: 'Siswa belum mengikuti test',
    };
  }

  @Get('list-lulus')
async listKelulusan() {
  const pendaftars = await this.pendaftarRepo.find({
    where: { statusTest: 'sudah test' },
  });

  const hasil = [];

  for (const pendaftar of pendaftars) {
    const nilai = pendaftar.nilai || 0;
    let statusKelulusan: 'Lulus' | 'Tidak Lulus' | 'Ditunda' = 'Ditunda';
    let message = '';

    if (nilai < 75) {
      statusKelulusan = 'Tidak Lulus';
      message = 'Nilai di bawah 75, tidak lulus.';
    } else if (
      !pendaftar.sudahVerifikasi ||
      !pendaftar.sudahWawancara ||
      !pendaftar.uploadBerkas
    ) {
      statusKelulusan = 'Ditunda';
      message =
        'Kelulusan ditunda, lengkapi verifikasi, wawancara, dan upload berkas.';
    } else {
      statusKelulusan = 'Lulus';
      message = 'Selamat, Anda lulus!';
    }

    // Simpan statusKelulusan ke DB
    await this.pendaftarRepo.update(pendaftar.id, { statusKelulusan } as Partial<Pendaftar>);

    hasil.push({
      ...pendaftar,
      statusKelulusan,
      message,
    });
  }

  return hasil;
}

}
