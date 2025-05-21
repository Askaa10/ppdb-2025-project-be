import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SubmitAnswerDto {
  @IsNumber()
  questionId: number;

  @IsString()
  @IsNotEmpty()
  selected: string;

}