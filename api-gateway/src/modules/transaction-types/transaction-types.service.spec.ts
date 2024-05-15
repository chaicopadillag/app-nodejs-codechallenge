import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { TransactionPublisher } from '../transactions/publishers';
import { TransactionTypeEntity } from './entities';
import { TransactionTypesService } from './transaction-types.service';

describe('TransactionTypesService', () => {
  let service: TransactionTypesService;
  let transactionPublisher: TransactionPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionTypesService,
        {
          provide: TransactionPublisher,
          useValue: {
            send: jest.fn(),
            subscribeToResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionTypesService>(TransactionTypesService);
    transactionPublisher =
      module.get<TransactionPublisher>(TransactionPublisher);
  });

  it('should call TransactionPublisher send method with correct parameters', () => {
    const expectedTopic = 'find_all_transaction_types';
    jest.spyOn(transactionPublisher, 'send').mockReturnValueOnce(of([]));

    service.findAllTransactionTypes();
    expect(transactionPublisher.send).toHaveBeenCalledWith(expectedTopic, {});
  });

  it('should return observable of TransactionTypeEntity[]', () => {
    const expectedData: TransactionTypeEntity[] = [
      {
        id: '377f2cd2-dfe7-43c5-a02d-eb1a92c8e634',
        code: 'TB',
        name: 'Transactión Bancaria',
      },
      {
        id: '66ff79b8-581d-46cc-88e4-a5df540fb9d9',
        code: 'PB',
        name: 'Pago Billetera',
      },
    ];

    jest
      .spyOn(transactionPublisher, 'send')
      .mockReturnValueOnce(of(expectedData));

    const result = service.findAllTransactionTypes();
    result.subscribe((data) => {
      expect(data).toStrictEqual(expectedData);
    });
  });
});
