import { Question } from './../question/question.entity';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { Repository } from 'typeorm';
import { AnswerService } from './answer.service';
import { SubmitAnswerDto } from './answer.dto';
import { Pendaftar } from '../pendaftaran/pendaftar.entity'; // import entity Pendaftar

@Controller('answer')
export class AnswerController {
  constructor(
    @InjectRepository(Answer)
    private readonly AnswerRepository: Repository<Answer>,
    private readonly AnswerService: AnswerService,
    @InjectRepository(Question)
    private readonly QuestionRepository: Repository<Question>,
    @InjectRepository(Pendaftar)
    private readonly PendaftarRepository: Repository<Pendaftar>, // tambahkan ini
  ) {}

  @Post('submit-answer/:id')
  async submitAnswer(
    @Param('id') id: string, // id pendaftar (bukan id answer)
    @Body() answerData: any,
  ) {
    // Simpan jawaban siswa di sini jika perlu

    // Update statusTest di tabel Pendaftar
    await this.PendaftarRepository.update({ id }, { statusTest: 'sudah test' } as Partial<Pendaftar>);

    return { message: 'Jawaban diterima dan status test sudah diupdate.' };
  }

  @Post('submit-all/:id')
async submitAllAnswers(
  @Param('id') id: string,
  @Body() body: { answers: { questionId: number; selected: string }[] }
) {
  const result = await this.AnswerService.submitAllAnswers(id, body.answers);

  // Simpan nilai dan statusTest ke pendaftar
  await this.PendaftarRepository.update(
    { id },
    { nilai: result.nilai, statusTest: 'sudah test' } as Partial<Pendaftar>
  );

  return {
    message: 'Jawaban dinilai dan nilai sudah disimpan.',
    nilai: result.nilai,
  };
}

}
