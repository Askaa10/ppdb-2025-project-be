import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pendaftar } from '../pendaftaran/pendaftar.entity';
import { Repository } from 'typeorm';
import { Answer } from '../answer/answer.entity';

@Injectable()
export class CekKelulusanService {
  constructor(
    @InjectRepository(Pendaftar)
    private readonly pendaftarRepo: Repository<Pendaftar>,
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,
  ) {}

  async cekKelulusan(nis: string, nisn: string, nik: string) {
    const pendaftar = await this.pendaftarRepo.findOneBy({ nis, nisn, nik });

    if (!pendaftar) {
      return {
        message: 'Data siswa tidak ditemukan',
        status: 'error',
      };
    }

    const jawabanBenar = await this.answerRepo.count({
      where: { isCorrect: true },
    });

    const totalSoal = await this.answerRepo.count();

    const persen = totalSoal ? (jawabanBenar / totalSoal) * 100 : 0;
    const lulus = persen >= 70;

    return {
      nama: pendaftar.nama,
      nis: pendaftar.nis,
      nisn: pendaftar.nisn,
      nik: pendaftar.nik,
      status: lulus ? 'Selamat anda lulus' : 'Maaf Anda Tidak Lulus',
      nilai: `${jawabanBenar}/${totalSoal} (${Math.round(persen)}%)`,
    };
  }
}