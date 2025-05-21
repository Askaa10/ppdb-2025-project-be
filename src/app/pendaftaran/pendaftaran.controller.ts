import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pendaftar } from './pendaftar.entity';
import { createDto } from './pendaftaran.dto';

@Controller('pendaftar')
export class PendaftarController {
  constructor(
    @InjectRepository(Pendaftar)
    private readonly repo: Repository<Pendaftar>,
  ) {}

  @Post('daftar-siswa')
  async create(@Body() data: createDto) {
    const id = `PPDBMQ${Date.now().toString().slice(-8)}`;

    const pendaftarEntity = this.repo.create({
      id: id,
      ...data,
      jenisKelamin: data.jenisKelamin as 'Laki-laki' | 'Perempuan',
      statusTest: 'belum test', // <-- default status
    });
    console.log('Data diterima:', data); // debug
    return await this.repo.save(pendaftarEntity);
  }

  @Get('list-siswa')
  async findAll() {
    return await this.repo.find();
  }

  @Get('detail-siswa/:id')
  async findOne(@Body('id') id: string) {
    return await this.repo.findOne({ where: { id } });
  }

  @Post('update-siswa/:id')
  async update(@Param('id') id: string, @Body() data: Partial<Pendaftar>) {
    return await this.repo.update({ id }, data);
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
