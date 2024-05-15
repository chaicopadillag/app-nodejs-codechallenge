import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { TransactionTypeEntity } from './entities';
import { TransactionTypesResolver } from './transaction-types.resolver';
import { TransactionTypesService } from './transaction-types.service';

describe('TransactionTypesResolver', () => {
  let resolver: TransactionTypesResolver;
  let transactionTypesService: TransactionTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionTypesResolver,
        {
          provide: TransactionTypesService,
          useValue: {
            findAllTransactionTypes: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<TransactionTypesResolver>(TransactionTypesResolver);
    transactionTypesService = module.get<TransactionTypesService>(
      TransactionTypesService,
    );
  });

  it('should return array of TransactionTypeEntity', async () => {
    const expectedData: TransactionTypeEntity[] = [
      {
        id: '377f2cd2-dfe7-43c5-a02d-eb1a92c8e634',
        code: 'TB',
        name: 'Transactión Bancaria',
      },
    ];
    jest
      .spyOn(transactionTypesService, 'findAllTransactionTypes')
      .mockReturnValueOnce(of(expectedData));

    const result = await resolver.getAll().toPromise();
    expect(result).toStrictEqual(expectedData);
  });

  it('should call TransactionTypesService findAllTransactionTypes method', async () => {
    jest
      .spyOn(transactionTypesService, 'findAllTransactionTypes')
      .mockReturnValueOnce(of([]));

    await resolver.getAll().toPromise();
    expect(transactionTypesService.findAllTransactionTypes).toHaveBeenCalled();
  });
});
