import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('pendaftaran')
export class Pendaftar {
  @PrimaryColumn('varchar', { length: 20 })
  id: string;

  @Column()
  nama: string;

  @Column()
  nis: string;

  @Column()
  nisn: string;

  @Column()
  nik: string;

  @Column()
  tempatLahir: string;

  @Column()
  tanggalLahir: string;

  @Column()
  jenisKelamin: 'Laki-laki' | 'Perempuan';

  @Column()
  asalSekolah: string;

  @Column()
  noTelpSiswa: string;

  @Column()
  alamatSiswa: string;

  @Column()
  namaAyah: string;

  @Column()
  namaIbu: string;

  @Column()
  pekerjaanAyah: string;

  @Column()
  pekerjaanIbu: string;

  @Column()
  noTelpOrtu: string;

  @Column()
  alamatOrtu: string;

  @Column({ default: false })
  sudahVerifikasi: boolean;

  @Column({ default: false })
  sudahWawancara: boolean;

  @Column({ default: false })
  uploadBerkas: boolean;

  @Column({ type: 'varchar', length: 9 })
  tahunAjaran: string;

  @Column({ default: 'belum test' })
  statusTest: 'sudah test' | 'belum test';

  @Column({ type: 'varchar', nullable: true })
  statusKelulusan: 'Lulus' | 'Tidak Lulus' | 'Ditunda';

  @Column({ type: 'int', nullable: true })
  nilai: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
