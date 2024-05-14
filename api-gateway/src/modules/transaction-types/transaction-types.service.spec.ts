import { Test, TestingModule } from '@nestjs/testing';
import { TransactionTypesService } from './transaction-types.service';

describe('TransactionTypesService', () => {
  let service: TransactionTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionTypesService],
    }).compile();

    service = module.get<TransactionTypesService>(TransactionTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
