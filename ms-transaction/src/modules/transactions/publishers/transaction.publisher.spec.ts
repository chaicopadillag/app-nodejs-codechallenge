import { TRANSPORT_SERVICE } from '@/transports';
import { ClientKafka } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { Transaction, TransferStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionPublisher } from './transaction.publisher';

describe('TransactionPublisher', () => {
  let transactionPublisher: TransactionPublisher;
  let clientKafkaMock: Partial<ClientKafka>;

  beforeEach(async () => {
    clientKafkaMock = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionPublisher,
        {
          provide: TRANSPORT_SERVICE,
          useValue: clientKafkaMock,
        },
      ],
    }).compile();

    transactionPublisher =
      module.get<TransactionPublisher>(TransactionPublisher);
  });

  it('should be defined', () => {
    expect(transactionPublisher).toBeDefined();
  });

  describe('emit', () => {
    it('should emit message with topic and payload', () => {
      const topic = 'update_transaction_status';

      const payload: Transaction = {
        id: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
        status: TransferStatus.pending,
        accountExternalIdCredit: '907f34f5-eb2e-4547-a7bf-b9397529f9d8',
        accountExternalIdDebit: '0936d64f-17c0-405e-81a0-c0b3977ab512',
        transferTypeId: '625b8510-74a6-42c2-9bbe-bbb4cdaa16e3',
        createdAt: new Date('2022-05-14T12:00:00.000Z'),
        updatedAt: new Date('2022-05-14T12:00:00.000Z'),
        value: new Decimal(1000),
      };

      transactionPublisher.emit(topic, payload);

      expect(clientKafkaMock.emit).toHaveBeenCalledWith(
        topic,
        JSON.stringify(payload),
      );
    });
  });
});
