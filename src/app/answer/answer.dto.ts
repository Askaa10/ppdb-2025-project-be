import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SubmitAnswerDto {
  @IsNumber()
  questionId: number;

  @IsString()
  @IsNotEmpty()
  selected: string;

  @IsString()
  @IsNotEmpty()
  nis: string;

  @IsString()
  @IsNotEmpty()
  nisn: string;

  @IsString()
  @IsNotEmpty()
  nik: string;
}