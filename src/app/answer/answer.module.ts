// src/answer/answer.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { Question } from '../question/question.entity';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { Pendaftar } from '../pendaftaran/pendaftar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question, Pendaftar])],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
