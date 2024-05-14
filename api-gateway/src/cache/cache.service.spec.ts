import { TransactionEntity } from '@/modules/transactions/entities';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  const mockData: TransactionEntity = {
    transactionExternalId: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
    transactionType: { name: 'Transferencia Bancaria' },
    transactionStatus: { name: 'approved' },
    value: 1000,
    createdAt: '2022-05-14T12:00:00.000Z',
  };

  let service: CacheService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should call cacheManager get method with correct key', () => {
    const key = mockData.transactionExternalId;

    jest
      .spyOn(cacheManager, 'get')
      .mockReturnValueOnce(Promise.resolve(mockData));

    service.get(key).subscribe({
      next: (data) => {
        expect(data).toStrictEqual(mockData);
      },
    });
    expect(cacheManager.get).toHaveBeenCalledWith(key);
  });

  it('should call cacheManager set method with correct key and value', () => {
    const key = mockData.transactionExternalId;
    const value = mockData;
    jest
      .spyOn(cacheManager, 'set')
      .mockReturnValueOnce(Promise.resolve(undefined));

    service.set(key, value).subscribe();
    expect(cacheManager.set).toHaveBeenCalledWith(key, value);
  });
});
