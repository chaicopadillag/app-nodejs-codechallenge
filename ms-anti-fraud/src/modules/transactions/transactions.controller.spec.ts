import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionType, TransferStatus } from './types';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: { processTransaction: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processTransaction', () => {
    it('should call processTransaction method of TransactionsService', () => {
      const payload: TransactionType = {
        id: '8f08ba13-d7b8-420a-b3c1-4e6193ad428e',
        status: TransferStatus.pending,
        value: 1500,
      };
      const processTransactionSpy = jest.spyOn(service, 'processTransaction');

      controller.processTransaction(payload);

      expect(processTransactionSpy).toHaveBeenCalledWith(payload);
    });
  });
});
