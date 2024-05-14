import { transactionConfig } from '@/config';
import { ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TransferStatus } from '../types';
import { TransactionValidator } from './transaction.validator';

describe('TransactionValidator', () => {
  let validator: TransactionValidator;
  let config: ConfigType<typeof transactionConfig>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionValidator,
        {
          provide: transactionConfig.KEY,
          useValue: {
            maxTransactionValue: 1000,
          },
        },
      ],
    }).compile();

    validator = module.get<TransactionValidator>(TransactionValidator);
    config = module.get<ConfigType<typeof transactionConfig>>(
      transactionConfig.KEY,
    );
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should return approved if value is less than maxTransactionValue', () => {
      const value = 500;
      expect(validator.validate(value)).toEqual(TransferStatus.approved);
    });

    it('should return rejected if value is greater than maxTransactionValue', () => {
      const value = 1500;
      expect(validator.validate(value)).toEqual(TransferStatus.rejected);
    });

    it('should return approved if value is equal to maxTransactionValue', () => {
      const value = config.maxTransactionValue;
      expect(validator.validate(value)).toEqual(TransferStatus.approved);
    });
  });
});
