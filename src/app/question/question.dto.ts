import { IsArray, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  question: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsString()
  answer: string;

  @IsString()
  mapel: string;
}