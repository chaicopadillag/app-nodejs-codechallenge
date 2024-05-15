import { PrismaService } from '@/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { Transaction, TransferStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto';
import { TransactionRepository } from './transaction.repository';

describe('TransactionRepository', () => {
  let repository: TransactionRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              create: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<TransactionRepository>(TransactionRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should call prismaService.transaction.create with provided data', async () => {
      const createTransactionDto: CreateTransactionDto = {
        accountExternalIdDebit: '71f8990f-6308-4952-a794-3e1aebc7c250',
        accountExternalIdCredit: '6164fed5-40fb-43fe-acac-37aa6b41da6c',
        transferTypeId: 'bd14d75e-dca3-4129-b0d6-28c746c2d706',
        value: 512,
      };
      const transaction: Transaction = {
        id: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
        status: TransferStatus.pending,
        accountExternalIdCredit: '907f34f5-eb2e-4547-a7bf-b9397529f9d8',
        accountExternalIdDebit: '0936d64f-17c0-405e-81a0-c0b3977ab512',
        transferTypeId: '625b8510-74a6-42c2-9bbe-bbb4cdaa16e3',
        createdAt: new Date('2022-05-14T12:00:00.000Z'),
        updatedAt: new Date('2022-05-14T12:00:00.000Z'),
        value: new Decimal(1000),
      };
      jest
        .spyOn(prismaService.transaction, 'create')
        .mockResolvedValueOnce(transaction);

      const result = await repository.create(createTransactionDto);

      expect(result).toEqual(transaction);
      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: createTransactionDto,
        include: { transactionType: true },
      });
    });
  });

  describe('update', () => {
    it('should call prismaService.transaction.update with provided data', async () => {
      const updateTransactionDto: UpdateTransactionDto = {
        id: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
        status: TransferStatus.approved,
      };
      const expectedTransaction: Transaction = {
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
        .spyOn(prismaService.transaction, 'update')
        .mockResolvedValueOnce(expectedTransaction);

      const result = await repository.update(updateTransactionDto);

      expect(result).toEqual(expectedTransaction);
      expect(prismaService.transaction.update).toHaveBeenCalledWith({
        where: { id: updateTransactionDto.id },
        data: { status: updateTransactionDto.status },
      });
    });
  });

  describe('findAll', () => {
    it('should call prismaService.transaction.findMany', async () => {
      const expectedTransactions: Transaction[] = [
        {
          id: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
          status: TransferStatus.approved,
          accountExternalIdCredit: '907f34f5-eb2e-4547-a7bf-b9397529f9d8',
          accountExternalIdDebit: '0936d64f-17c0-405e-81a0-c0b3977ab512',
          transferTypeId: '625b8510-74a6-42c2-9bbe-bbb4cdaa16e3',
          createdAt: new Date('2022-05-14T12:00:00.000Z'),
          updatedAt: new Date('2022-05-14T12:00:00.000Z'),
          value: new Decimal(1000),
        },
      ];
      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValueOnce(expectedTransactions);

      const result = await repository.findAll();

      expect(result).toEqual(expectedTransactions);
      expect(prismaService.transaction.findMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should call prismaService.transaction.findFirst with provided id', async () => {
      const id = 'f58ed7b0-63e0-4fdd-afd9-513312639fe5';
      const expectedTransaction: Transaction = {
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
        .spyOn(prismaService.transaction, 'findFirst')
        .mockResolvedValueOnce(expectedTransaction);

      const result = await repository.findById(id);

      expect(result).toEqual(expectedTransaction);
      expect(prismaService.transaction.findFirst).toHaveBeenCalledWith({
        where: { id },
        include: { transactionType: true },
      });
    });

    it('should return null if transaction is not found', async () => {
      const id = 'b69c410a-6fbd-4b5e-b1b5-e14bf4ac63d4';
      jest
        .spyOn(prismaService.transaction, 'findFirst')
        .mockResolvedValueOnce(null);

      const result = await repository.findById(id);

      expect(result).toBeNull();
      expect(prismaService.transaction.findFirst).toHaveBeenCalledWith({
        where: { id },
        include: { transactionType: true },
      });
    });
  });
});
