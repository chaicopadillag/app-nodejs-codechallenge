import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CreateTransactionInput } from './dto';
import { TransactionEntity } from './entities';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionsService } from './transactions.service';

describe('TransactionsResolver', () => {
  let resolver: TransactionsResolver;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsResolver,
        {
          provide: TransactionsService,
          useValue: {
            createTransaction: jest.fn(),
            findAllTransactions: jest.fn(),
            findTransactionById: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<TransactionsResolver>(TransactionsResolver);
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should call TransactionsService createTransaction method with correct parameters', () => {
    const createTransactionInput: CreateTransactionInput = {
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

    jest
      .spyOn(transactionsService, 'createTransaction')
      .mockReturnValueOnce(of(mockData));

    resolver.createTransaction(createTransactionInput).subscribe({
      next: (data) => {
        expect(data).toStrictEqual(mockData);
      },
    });
    expect(transactionsService.createTransaction).toHaveBeenCalledWith(
      createTransactionInput,
    );
  });

  it('should call TransactionsService findAllTransactions method', () => {
    const mockData: TransactionEntity[] = [
      {
        transactionExternalId: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
        transactionType: { name: 'Transferencia Bancaria' },
        transactionStatus: { name: 'approved' },
        value: 1000,
        createdAt: '2022-05-14T12:00:00.000Z',
      },
    ];

    jest
      .spyOn(transactionsService, 'findAllTransactions')
      .mockReturnValueOnce(of(mockData));

    resolver.getAllTransactions().subscribe({
      next: (data) => {
        expect(data).toStrictEqual(mockData);
      },
    });
    expect(transactionsService.findAllTransactions).toHaveBeenCalled();
  });

  it('should call TransactionsService findTransactionById method with correct parameters', () => {
    const id = 'f58ed7b0-63e0-4fdd-afd9-513312639fe5';
    const mockData: TransactionEntity = {
      transactionExternalId: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
      transactionType: { name: 'Transferencia Bancaria' },
      transactionStatus: { name: 'approved' },
      value: 1000,
      createdAt: '2022-05-14T12:00:00.000Z',
    };

    jest
      .spyOn(transactionsService, 'findTransactionById')
      .mockReturnValueOnce(of(mockData));

    resolver.findTransactionById(id).subscribe({
      next: (data) => {
        expect(data).toStrictEqual(mockData);
      },
    });
    expect(transactionsService.findTransactionById).toHaveBeenCalledWith(id);
  });
});
