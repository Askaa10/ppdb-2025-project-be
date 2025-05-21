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
    });

    return this.answerRepo.save(answer);
  }

  async submitAllAnswers(
    pendaftarId: string,
    answers: { questionId: number; selected: string }[],
  ) {
    let totalScore = 0;

    for (const ans of answers) {
      const question = await this.questionRepo.findOneBy({ id: ans.questionId });
      if (!question) continue;

      const isCorrect = question.answer === ans.selected;
      if (isCorrect) totalScore += 1;

      await this.answerRepo.save(
        this.answerRepo.create({
          text: ans.selected,
          question,
          isCorrect,
          // tambahkan relasi ke pendaftar jika ada
        }),
      );
    }

    // Hitung rata-rata (misal 1 soal = 1 poin, rata-rata = total/n soal)
    const jumlahSoal = answers.length || 1;
    const nilai = Math.round((totalScore / jumlahSoal) * 100);

    return { nilai };
  }
}
