import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { CreateQuestionDto } from './question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private repo: Repository<Question>,
  ) {}

  async create(data: CreateQuestionDto): Promise<Question> {
    const question = this.repo.create(data);
    return this.repo.save(question);
  }

  async findAll() {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.repo.findOneBy({ id });
    if (!question) throw new Error('Soal tidak ditemukan');
    return question;
  }

  async update(id: number, data: Partial<Question>) {
    await this.repo.update(id, data);
    const updated = await this.findOne(id);
    return {
      message: 'Soal berhasil diperbarui',
      data: updated,
    };
  }

  remove(id: number) {
    return this.repo.delete(id);
  }

  // mapel
  async findByMapel(mapel: string) {
  return this.repo.find({ where: { mapel } });
}

}
