import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pendaftar } from '../pendaftaran/pendaftar.entity';
import { Answer } from '../answer/answer.entity';
import { CekKelulusanService } from './kelulusan.service';
import { CekKelulusanController } from './kelulusan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pendaftar, Answer])],
  providers: [CekKelulusanService],
  controllers: [CekKelulusanController],
})
export class CekKelulusanModule {}