import { Test, TestingModule } from '@nestjs/testing';
import { Transaction, TransactionType, TransferStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { transactionMapper } from './mappers';
import { InputTransactionType } from './mappers/interfaces';
import { TransactionPublisher } from './publishers';
import { TransactionRepository, TransactionTypeRepository } from './repository';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepository: TransactionRepository;
  let transactionTypeRepository: TransactionTypeRepository;
  let transactionPublisher: TransactionPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: TransactionTypeRepository,
          useValue: {
            findAll: jest.fn(),
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
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    transactionTypeRepository = module.get<TransactionTypeRepository>(
      TransactionTypeRepository,
    );
    transactionPublisher =
      module.get<TransactionPublisher>(TransactionPublisher);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        accountExternalIdDebit: '71f8990f-6308-4952-a794-3e1aebc7c250',
        accountExternalIdCredit: '6164fed5-40fb-43fe-acac-37aa6b41da6c',
        transferTypeId: 'bd14d75e-dca3-4129-b0d6-28c746c2d706',
        value: 512,
      };
      const createdTransaction: InputTransactionType = {
        id: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
        status: TransferStatus.pending,
        transactionType: { name: 'Transferencia Bancaria' },
        value: new Decimal(1000),
        createdAt: new Date('2022-05-14T12:00:00.000Z'),
      };
      jest
        .spyOn(transactionRepository, 'create')
        .mockReturnValueOnce(Promise.resolve(createdTransaction) as any);

      const result = await service.create(createTransactionDto).toPromise();

      expect(result).toEqual(
        JSON.stringify(transactionMapper(createdTransaction as any)),
      );
      expect(transactionRepository.create).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(transactionPublisher.emit).toHaveBeenCalledWith(
        'process_transaction',
        createdTransaction,
      );
    });
  });

  describe('update', () => {
    it('should update an existing transaction', async () => {
      const updateTransactionDto: UpdateTransactionDto = {
        id: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
        status: TransferStatus.approved,
      };
      const updatedTransaction: Transaction = {
        id: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
        status: TransferStatus.approved,
        accountExternalIdCredit: '907f34f5-eb2e-4547-a7bf-b9397529f9d8',
        accountExternalIdDebit: '0936d64f-17c0-405e-81a0-c0b3977ab512',
        transferTypeId: '625b8510-74a6-42c2-9bbe-bbb4cdaa16e3',
        createdAt: new Date('2022-05-14T12:00:00.000Z'),
        updatedAt: new Date('2022-05-14T12:00:00.000Z'),
        value: new Decimal(1000),
      };
      jest
        .spyOn(transactionRepository, 'update')
        .mockReturnValueOnce(Promise.resolve(updatedTransaction));

      const result = await service.update(updateTransactionDto).toPromise();

      expect(result).toEqual(updatedTransaction);
      expect(transactionRepository.update).toHaveBeenCalledWith(
        updateTransactionDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const transactions: any[] = [
        {
          id: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
          status: TransferStatus.pending,
          transactionType: { name: 'Transferencia Bancaria' },
          value: new Decimal(1000),
          createdAt: new Date('2022-05-14T12:00:00.000Z'),
        },
      ];
      jest
        .spyOn(transactionRepository, 'findAll')
        .mockReturnValueOnce(Promise.resolve(transactions));

      const result = await service.findAll().toPromise();

      expect(result).toEqual(transactions.map(transactionMapper as any));
    });
  });

  describe('findById', () => {
    it('should return transaction by id', async () => {
      const id = 'f58ed7b0-63e0-4fdd-afd9-513312639fe5';
      const transaction: any = {
        id: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
        status: TransferStatus.pending,
        transactionType: { name: 'Transferencia Bancaria' },
        value: new Decimal(1000),
        createdAt: new Date('2022-05-14T12:00:00.000Z'),
      };
      jest
        .spyOn(transactionRepository, 'findById')
        .mockReturnValueOnce(Promise.resolve(transaction));

      const result = await service.findById(id).toPromise();

      expect(result).toEqual(
        JSON.stringify(transactionMapper(transaction as any)),
      );
    });
  });

  describe('findAllTansferTypes', () => {
    it('should return all transfer types', async () => {
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
        .spyOn(transactionTypeRepository, 'findAll')
        .mockReturnValueOnce(Promise.resolve(transferTypes));

      const result = await service.findAllTansferTypes().toPromise();

      expect(result).toEqual(transferTypes);
    });
  });
});
