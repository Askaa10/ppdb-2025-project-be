import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Pendaftar } from './pendaftar.entity';
import { OmitType } from '@nestjs/mapped-types';
import { Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';


export class createDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  nis: string;

  @IsString()
  nisn: string;

  @IsString()
  nik: string;

  @IsString()
  tempatLahir: string;

  @IsString()
  tanggalLahir: string;

  @IsString()
  jenisKelamin: string;

  @IsString()
  asalSekolah: string;

  @IsString()
  noTelpSiswa: string;

  @IsString()
  alamatSiswa: string;

  @IsString()
  namaAyah: string;

  @IsString()
  namaIbu: string;

  @IsString()
  pekerjaanAyah: string;

  @IsString()
  pekerjaanIbu: string;

  @IsString()
  noTelpOrtu: string;

  @IsString()
  alamatOrtu: string;

  @IsString()
  @IsOptional()
  tahunAjaran: string;

  
  @Column({ default: false })
  sudahVerifikasi: boolean;

  @Column({ default: false })
  sudahWawancara: boolean;

  @Column({ default: false })
  uploadBerkas: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

