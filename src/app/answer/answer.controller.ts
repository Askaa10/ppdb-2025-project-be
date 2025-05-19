import { Question } from './../question/question.entity';
import { Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { Repository } from 'typeorm';
import { AnswerService } from './answer.service';

@Controller('answer')
export class AnswerController {
     constructor(
        @InjectRepository(Answer)
        private readonly AnswerRepository: Repository<Answer>,
        private readonly AnswerService: AnswerService,
        @InjectRepository(Question)
        private readonly QuestionRepository: Repository<Question>,
      ) {}

      @Post('submit-answer')
      async submitAnswer(@Body() data: Answer) {
        return this.AnswerService.submitAnswer(data.id, data.text);
      }
}