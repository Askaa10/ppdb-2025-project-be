import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { Answer } from '../answer/answer.entity';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('tambah-soal')
  async create(@Body() data: CreateQuestionDto) {
    return this.questionService.create(data);
  }

  @Get('list-soal')
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.questionService.findOne(Number(id));
  }

  @Patch(':id') // GANTI dari @Post ke @Patch
  update(@Param('id') id: number, @Body() data: Partial<Question>) {
    return this.questionService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.questionService.remove(Number(id));
  }

  // mapel
  @Get('mapel/:mapel')
findByMapel(@Param('mapel') mapel: string) {
  return this.questionService.findByMapel(mapel);
}

}
