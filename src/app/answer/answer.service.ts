import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './answer.entity';
import { Question } from '../question/question.entity';
import { SubmitAnswerDto } from './answer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {}

async submitAnswer(dto: SubmitAnswerDto) {
  const question = await this.questionRepo.findOneBy({ id: dto.questionId });
  if (!question) throw new NotFoundException('Soal tidak ditemukan');

  const isCorrect = question.answer === dto.selected;

  const answer = this.answerRepo.create({
    text: dto.selected,
    question,
    isCorrect,
    nis: dto.nis,
    nisn: dto.nisn,
    nik: dto.nik,
  });

  return this.answerRepo.save(answer);
}
}
