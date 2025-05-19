import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pendaftar } from './pendaftar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pendaftar])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class PendaftarModule {}