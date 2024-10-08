import { Test, TestingModule } from '@nestjs/testing';
import { TournametService } from './tournamet.service';

describe('TournametService', () => {
  let service: TournametService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournametService],
    }).compile();

    service = module.get<TournametService>(TournametService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
