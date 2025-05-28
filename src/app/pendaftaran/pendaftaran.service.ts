import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pendaftar } from './pendaftar.entity';

@Injectable()
export class PendaftaranService {
  constructor(
    @InjectRepository(Pendaftar)
    private readonly pendaftarRepository: Repository<Pendaftar>,
  ) {}

}