import { Test, TestingModule } from '@nestjs/testing';
import { TransactionType, TransferStatus } from '@prisma/client';
import { of } from 'rxjs';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { OutputTransactionI } from './mappers/interfaces';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findAllTansferTypes: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should create a transaction', async () => {
    const createTransactionDto: CreateTransactionDto = {
      accountExternalIdDebit: '71f8990f-6308-4952-a794-3e1aebc7c250',
      accountExternalIdCredit: '6164fed5-40fb-43fe-acac-37aa6b41da6c',
      transferTypeId: 'bd14d75e-dca3-4129-b0d6-28c746c2d706',
      value: 512,
    };

    const dataResponse: OutputTransactionI = {
      transactionExternalId: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
      transactionType: { name: 'Transferencia Bancaria' },
      transactionStatus: { name: 'pending' },
      value: 1000,
      createdAt: new Date('2022-05-14T12:00:00.000Z'),
    };

    jest
      .spyOn(transactionsService, 'create')
      .mockReturnValueOnce(of(JSON.stringify(dataResponse)));

    const result = await controller
      .createTransaction(createTransactionDto)
      .toPromise();
    expect(result).toBeDefined();
    expect(result).toEqual(JSON.stringify(dataResponse));
  });

  it('should update transaction status', () => {
    const updateTransactionDto: UpdateTransactionDto = {
      id: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
      status: TransferStatus.approved,
    };
    jest
      .spyOn(transactionsService, 'update')
      .mockReturnValueOnce(of(undefined));

    expect(controller.updateTransactionStatus(updateTransactionDto)).toEqual(
      undefined,
    );
  });

  it('should find all transactions', async () => {
    const dataResponse: OutputTransactionI[] = [
      {
        transactionExternalId: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
        transactionType: { name: 'Transferencia Bancaria' },
        transactionStatus: { name: 'pending' },
        value: 1000,
        createdAt: new Date('2022-05-14T12:00:00.000Z'),
      },
    ];

    jest
      .spyOn(transactionsService, 'findAll')
      .mockReturnValueOnce(of(dataResponse));

    const result = await controller.findAllTransactions().toPromise();
    expect(result).toBeDefined();
    expect(result).toStrictEqual(dataResponse);
  });

  it('should find transaction by id', async () => {
    const transactionId = 'f58ed7b0-63e0-4fdd-afd9-513312639fe5';

    const dataResponse: OutputTransactionI = {
      transactionExternalId: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
      transactionType: { name: 'Transferencia Bancaria' },
      transactionStatus: { name: 'pending' },
      value: 1000,
      createdAt: new Date('2022-05-14T12:00:00.000Z'),
    };

    jest
      .spyOn(transactionsService, 'findById')
      .mockReturnValueOnce(of(JSON.stringify(dataResponse)));

    const result = await controller
      .findTransactionById(transactionId)
      .toPromise();
    expect(result).toBeDefined();

    expect(result).toStrictEqual(JSON.stringify(dataResponse));
  });

  it('should find all transaction types', async () => {
    const transferTypes: TransactionType[] = [
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
      .spyOn(transactionsService, 'findAllTansferTypes')
      .mockReturnValueOnce(of(transferTypes));

    const result = await controller.findAllTransacionTypes().toPromise();
    expect(result).toBeDefined();
    expect(result).toStrictEqual(transferTypes);
  });
});
