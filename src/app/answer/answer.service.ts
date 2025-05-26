import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './answer.entity';
import { Question } from '../question/question.entity';
import { Pendaftar } from '../pendaftaran/pendaftar.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Pendaftar) private pendaftarRepo: Repository<Pendaftar>,
  ) {}

  async submitAllAnswers(
    pendaftarId: string,
    answers: { questionId: number; selected: string }[],
  ) {
    const pendaftar = await this.pendaftarRepo.findOneBy({ id: pendaftarId });
    if (!pendaftar) throw new NotFoundException('Pendaftar tidak ditemukan');

    let totalScore = 0;

    for (const ans of answers) {
      const question = await this.questionRepo.findOneBy({ id: ans.questionId });
      if (!question) continue;

      const isCorrect = question.answer === ans.selected;
      if (isCorrect) totalScore += 1;

      const answer = this.answerRepo.create({
        text: ans.selected,
        question,
        isCorrect,
        pendaftar, // simpan relasi ke siswa
      });

      await this.answerRepo.save(answer);
    }

    const jumlahSoal = answers.length || 1;
    const nilai = Math.round((totalScore / jumlahSoal) * 100);

    // Simpan nilai dan status test
    await this.pendaftarRepo.update(
      { id: pendaftarId },
      { nilai, statusTest: 'sudah test' } as Partial<Pendaftar>,
    );

    return { nilai };
  }
}
