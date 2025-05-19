import { Test, TestingModule } from '@nestjs/testing';
import { PendaftarController } from './pendaftaran.controller';

describe('PendaftaranController', () => {
  let controller: PendaftarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PendaftarController],
    }).compile();

    controller = module.get<PendaftarController>(PendaftarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
