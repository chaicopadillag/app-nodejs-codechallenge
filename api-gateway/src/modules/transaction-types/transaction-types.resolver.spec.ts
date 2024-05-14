import { Test, TestingModule } from '@nestjs/testing';
import { TransactionTypesResolver } from './transaction-types.resolver';

describe('TransactionTypesResolver', () => {
  let resolver: TransactionTypesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionTypesResolver],
    }).compile();

    resolver = module.get<TransactionTypesResolver>(TransactionTypesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
