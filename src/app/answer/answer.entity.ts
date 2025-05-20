import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from '../question/question.entity';

@Entity('verry_answer')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Question, (question) => question.answer)
  question: Question;

  @Column({ default: false })
  isCorrect: boolean;

  @Column()
  nis: string;

  @Column()
  nisn: string;

  @Column()
  nik: string;
}

