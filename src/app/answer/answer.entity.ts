import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from '../question/question.entity';
import { Pendaftar } from '../pendaftaran/pendaftar.entity';

@Entity('verry_answer')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Question, (question) => question.answer)
  question: Question;

  @ManyToOne(() => Pendaftar, (pendaftar) => pendaftar.answers, {
    onDelete: 'CASCADE', // ⬅️ ini penting
  })
  pendaftar: Pendaftar;

  @Column({ default: false })
  isCorrect: boolean;
}
