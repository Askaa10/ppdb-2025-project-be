import { Test, TestingModule } from '@nestjs/testing';
import { KelulusanService } from './kelulusan.service';

describe('KelulusanService', () => {
  let service: KelulusanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KelulusanService],
    }).compile();

    service = module.get<KelulusanService>(KelulusanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
