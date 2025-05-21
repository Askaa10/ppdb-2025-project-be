import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('kelulusan')
export class CekKelulusanDto {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  @Column()
  nis: string;
  @Column()
  nisn: string;
  @Column()
  nik: string;
}