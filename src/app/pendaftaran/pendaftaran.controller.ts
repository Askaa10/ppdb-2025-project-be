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
      id,
      ...data,
      jenisKelamin: data.jenisKelamin as 'Laki-laki' | 'Perempuan',
      statusTest: 'belum test',
    });
    const saved = await this.repo.save(pendaftarEntity);
    return {
      success: true,
      message: 'Pendaftaran berhasil',
      data: saved,
    };
  }

  @Post('cek-siswa')
  async cekIdSiswa(@Body() body: { id: string }) {
    const { id } = body;
    if (!id) throw new BadRequestException('ID siswa harus diisi');
    const siswa = await this.repo.findOne({ where: { id } });
    if (!siswa) throw new NotFoundException('Siswa tidak ditemukan');
    return {
      success: true,
      message: 'Siswa valid',
      siswa: { id: siswa.id, nama: siswa.nama },
    };
  }

  @Get('list-siswa')
  async findAll() {
    const pendaftars = await this.repo.find();
    return pendaftars.map((pendaftar) => ({
      ...pendaftar,
      statusKelulusan: pendaftar.statusKelulusan ?? 'Status belum ditentukan',
    }));
  }

  @Get('detail-siswa/:id')
  async findOne(@Param('id') id: string) {
    const siswa = await this.repo.findOne({ where: { id } });
    if (!siswa) {
      throw new NotFoundException({
        success: false,
        message: `Siswa dengan ID ${id} tidak ditemukan`,
        
      });
      
    }
    return {
      success: true,
      message: 'Data siswa ditemukan',
      data: siswa,
    };
  }

  @Post('update-siswa/:id')
  async update(@Param('id') id: string, @Body() data: Partial<Pendaftar>) {
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
      'statusKelulusan',
      'nilai',
    ];

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        allowedFields.includes(key as keyof Pendaftar),
      ),
    );

    await this.repo.update({ id }, filteredData);
    return {
      success: true,
      message: 'Data siswa berhasil diperbarui',
    };
  }

  @Delete('delete-siswa/:id')
  async remove(@Param('id') id: string) {
    await this.repo.delete({ id });
    return {
      success: true,
      message: 'Data siswa berhasil dihapus',
    };
  }

  @Post('submit-test/:id')
  async submitTest(@Param('id') id: string) {
    await this.repo.update({ id }, {
      statusTest: 'sudah test',
    } as Partial<Pendaftar>);
    return { message: 'Status test siswa sudah diupdate menjadi sudah test.' };
  }
}
