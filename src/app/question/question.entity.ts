import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Question {
 @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  question: string;

  @Column('simple-array') // atau 'json'
  options: string[];

  @Column()
  answer: string;

  @Column()
  mapel: string;
}
