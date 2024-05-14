import { PrismaService } from '@/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionType } from '@prisma/client';
import { TransactionTypeRepository } from './transaction-type.repository';

describe('TransactionTypeRepository', () => {
  let repository: TransactionTypeRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionTypeRepository,
        {
          provide: PrismaService,
          useValue: {
            transactionType: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<TransactionTypeRepository>(
      TransactionTypeRepository,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should call prismaService.transactionType.findMany', async () => {
      const expectedTypes: TransactionType[] = [
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
        .spyOn(prismaService.transactionType, 'findMany')
        .mockResolvedValueOnce(expectedTypes);

      const result = await repository.findAll();

      expect(result).toEqual(expectedTypes);
      expect(prismaService.transactionType.findMany).toHaveBeenCalled();
    });
  });
});
