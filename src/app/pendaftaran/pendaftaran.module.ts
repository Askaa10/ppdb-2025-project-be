import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pendaftar } from './pendaftar.entity';
import { PendaftarController } from './pendaftaran.controller';
import { PendaftaranService } from './pendaftaran.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pendaftar])],
  controllers: [PendaftarController],
  providers: [PendaftaranService],
  exports: [PendaftaranService],
})
export class PendaftarModule {}
