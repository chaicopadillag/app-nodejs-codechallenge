import { CacheService } from '@/cache';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CreateTransactionInput } from './dto';
import { TransactionEntity } from './entities';
import { TransactionPublisher } from './publishers';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionPublisher: TransactionPublisher;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionPublisher,
          useValue: {
            send: jest.fn(),
            subscribeToResponse: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionPublisher =
      module.get<TransactionPublisher>(TransactionPublisher);
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should call TransactionPublisher send method with correct parameters for createTransaction', () => {
    const transactionInput: CreateTransactionInput = {
      accountExternalIdDebit: '71f8990f-6308-4952-a794-3e1aebc7c250',
      accountExternalIdCredit: '6164fed5-40fb-43fe-acac-37aa6b41da6c',
      transferTypeId: 'bd14d75e-dca3-4129-b0d6-28c746c2d706',
      value: 512,
    };

    const mockData: TransactionEntity = {
      transactionExternalId: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
      transactionType: { name: 'Transferencia Bancaria' },
      transactionStatus: { name: 'approved' },
      value: 1000,
      createdAt: '2022-05-14T12:00:00.000Z',
    };

    const expectedTopic = 'create_transaction';
    jest.spyOn(transactionPublisher, 'send').mockReturnValueOnce(of(mockData));

    service.createTransaction(transactionInput).subscribe({
      next: (data) => {
        expect(data).toStrictEqual(mockData);
      },
    });
    expect(transactionPublisher.send).toHaveBeenCalledWith(
      expectedTopic,
      transactionInput,
    );
  });

  it('should call TransactionPublisher send method with correct parameters for findAllTransactions', () => {
    const expectedTopic = 'find_all_transactions';
    const mockData: TransactionEntity[] = [
      {
        transactionExternalId: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
        transactionType: { name: 'Transferencia Bancaria' },
        transactionStatus: { name: 'approved' },
        value: 1000,
        createdAt: '2022-05-14T12:00:00.000Z',
      },
    ];

    jest.spyOn(transactionPublisher, 'send').mockReturnValueOnce(of(mockData));

    service.findAllTransactions().subscribe({
      next: (data) => {
        expect(data).toStrictEqual(mockData);
      },
    });
    expect(transactionPublisher.send).toHaveBeenCalledWith(expectedTopic, {});
  });

  it('should call TransactionPublisher send method with correct parameters for findTransactionById', () => {
    const id = 'f58ed7b0-63e0-4fdd-afd9-513312639fe5';

    const mockData: TransactionEntity = {
      transactionExternalId: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
      transactionType: { name: 'Transferencia Bancaria' },
      transactionStatus: { name: 'approved' },
      value: 1000,
      createdAt: '2022-05-14T12:00:00.000Z',
    };

    const expectedPayload = { id };
    jest.spyOn(transactionPublisher, 'send').mockReturnValueOnce(of(mockData));
    jest.spyOn(cacheService, 'get').mockReturnValueOnce(of(null));

    service.findTransactionById(id).subscribe({
      next: (data) => {
        expect(data).toStrictEqual(mockData);
      },
    });

    expect(transactionPublisher.send).toHaveBeenCalledWith(
      'find_transaction_by_id',
      expectedPayload,
    );
  });

  it('should return cached value for findTransactionById if available', async () => {
    const id = 'f58ed7b0-63e0-4fdd-afd9-513312639fe5';

    const cachedTransaction: TransactionEntity = {
      transactionExternalId: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
      transactionType: { name: 'Transferencia Bancaria' },
      transactionStatus: { name: 'approved' },
      value: 1000,
      createdAt: '2022-05-14T12:00:00.000Z',
    };
    jest.spyOn(cacheService, 'get').mockReturnValueOnce(of(cachedTransaction));

    const result = await service.findTransactionById(id).toPromise();
    expect(result).toStrictEqual(cachedTransaction);
  });

  it('should call set method of CacheService for findTransactionById if transaction not found in cache', () => {
    const id = 'f58ed7b0-63e0-4fdd-afd9-513312639fe5';

    const transactionResponse: TransactionEntity = {
      transactionExternalId: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
      transactionType: { name: 'Transferencia Bancaria' },
      transactionStatus: { name: 'approved' },
      value: 1000,
      createdAt: '2022-05-14T12:00:00.000Z',
    };
    jest.spyOn(cacheService, 'get').mockReturnValueOnce(of(null));
    jest
      .spyOn(transactionPublisher, 'send')
      .mockReturnValueOnce(of(transactionResponse));
    jest.spyOn(cacheService, 'set').mockReturnValueOnce(of(undefined));

    service.findTransactionById(id).subscribe({
      next: (data) => {
        expect(data).toStrictEqual(transactionResponse);
      },
    });
    expect(cacheService.set).toHaveBeenCalledWith(
      transactionResponse.transactionExternalId,
      transactionResponse,
    );
  });
});
