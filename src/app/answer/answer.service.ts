import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './answer.entity';
import { Question } from '../question/question.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {}

  async submitAnswer(questionId: number, selected: string) {
    const question = await this.questionRepo.findOneBy({ id: questionId });
    const isCorrect = question.answer === selected;

    const answer = this.answerRepo.create({
      text: selected,
      question,
      isCorrect,
    });

    return this.answerRepo.save(answer);
  }
}
