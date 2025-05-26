import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pendaftar } from './pendaftar.entity';
import { createDto } from './pendaftaran.dto';
import { PendaftaranService } from './pendaftaran.service';

@Controller('pendaftar')
export class PendaftarController {
  constructor(
    @InjectRepository(Pendaftar)
    private readonly repo: Repository<Pendaftar>,
    private readonly pendaftaranService: PendaftaranService,
  ) {}

  @Post('daftar-siswa')
  async create(@Body() data: createDto) {
    const id = `PPDBMQ${Date.now().toString().slice(-8)}`;

    const pendaftarEntity = this.repo.create({
      id: id,
      ...data,
      jenisKelamin: data.jenisKelamin as 'Laki-laki' | 'Perempuan',
      statusTest: 'belum test',
    });

    return await this.repo.save(pendaftarEntity);
  }

  @Post('cek-siswa')
  async cekSiswa(@Body() body: any) {
    const { nis, nisn, nik } = body;

    if (!nis || !nisn || !nik) {
      throw new BadRequestException('NIS, NISN, dan NIK harus diisi');
    }

    const siswa = await this.pendaftaranService.CekNisNisnNik(nis, nisn, nik);

    if (!siswa) {
      throw new NotFoundException('Siswa tidak ditemukan');
    }

    return { success: true, message: 'Siswa valid', siswa };
  }

  @Get('list-siswa')
  async findAll() {
    return await this.repo.find();
  }

  @Get('detail-siswa/:id')
  async findOne(@Param('id') id: string) {
    return await this.repo.findOne({ where: { id } });
  }

  @Post('update-siswa/:id')
  async update(@Param('id') id: string, @Body() data: Partial<Pendaftar>) {
    // Daftar field yang valid sesuai entity
    const allowedFields: (keyof Pendaftar)[] = [
      'nama',
      'nis',
      'nisn',
      'nik',
      'tempatLahir',
      'tanggalLahir',
      'jenisKelamin',
      'asalSekolah',
      'noTelpSiswa',
      'alamatSiswa',
      'namaAyah',
      'namaIbu',
      'pekerjaanAyah',
      'pekerjaanIbu',
      'noTelpOrtu',
      'alamatOrtu',
      'sudahVerifikasi',
      'sudahWawancara',
      'uploadBerkas',
      'tahunAjaran',
      'statusTest',
      'nilai',
    ];

    // Filter hanya field yang valid
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        allowedFields.includes(key as keyof Pendaftar),
      ),
    );

    return await this.repo.update({ id }, filteredData);
  }

  @Delete('delete-siswa/:id')
  async remove(@Param('id') id: string) {
    return await this.repo.delete({ id });
  }

  @Post('submit-test/:id')
  async submitTest(@Param('id') id: string) {
    await this.repo.update({ id }, { statusTest: 'sudah test' });
    return { message: 'Status test siswa sudah diupdate menjadi sudah test.' };
  }
}
