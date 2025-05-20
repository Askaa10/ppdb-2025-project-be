import { Test, TestingModule } from '@nestjs/testing';
import { KelulusanController } from './kelulusan.controller';

describe('KelulusanController', () => {
  let controller: KelulusanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KelulusanController],
    }).compile();

    controller = module.get<KelulusanController>(KelulusanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
