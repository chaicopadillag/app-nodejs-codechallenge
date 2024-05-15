import { Test, TestingModule } from '@nestjs/testing';
import { TransactionPublisher } from './publishers';
import { TransactionsService } from './transactions.service';
import { TransactionType, TransferStatus } from './types';
import { TransactionValidator } from './validators';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let validator: TransactionValidator;
  let publisher: TransactionPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionValidator,
          useValue: {
            validate: jest.fn().mockReturnValue(TransferStatus.approved),
          },
        },
        {
          provide: TransactionPublisher,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    validator = module.get<TransactionValidator>(TransactionValidator);
    publisher = module.get<TransactionPublisher>(TransactionPublisher);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processTransaction', () => {
    it('should call validate method of TransactionValidator', () => {
      const transaction: TransactionType = {
        id: 'd6bcb0bc-93ab-463c-ab91-69d865239db1',
        status: TransferStatus.pending,
        value: 100,
      };

      const validateSpy = jest.spyOn(validator, 'validate');

      service.processTransaction(transaction);

      expect(validateSpy).toHaveBeenCalledWith(transaction.value);
      expect(publisher.emit).toHaveBeenCalledWith('update_transaction_status', {
        id: transaction.id,
        status: TransferStatus.approved,
      });
    });

    it('should call emit method of TransactionPublisher with updated transaction status', () => {
      const transaction: TransactionType = {
        id: 'b3153051-c678-436a-8cb2-0dfabb08c591',
        status: TransferStatus.pending,
        value: 1200,
      };

      const validateSpy = jest
        .spyOn(validator, 'validate')
        .mockImplementation(() => TransferStatus.rejected);

      service.processTransaction(transaction);

      expect(validateSpy).toHaveBeenCalledWith(transaction.value);

      expect(publisher.emit).toHaveBeenCalledWith('update_transaction_status', {
        id: transaction.id,
        status: TransferStatus.rejected,
      });
    });
  });
});
