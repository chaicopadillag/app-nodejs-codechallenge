import { TRANSPORT_SERVICE } from '@/transports';
import { ClientKafka } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionPublishType, TransferStatus } from '../types';
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

      const payload: TransactionPublishType = {
        id: 'f58ed7b0-63e0-4fdd-afd9-513312639fe5',
        status: TransferStatus.approved,
      };

      transactionPublisher.emit(topic, payload);

      expect(clientKafkaMock.emit).toHaveBeenCalledWith(
        topic,
        JSON.stringify(payload),
      );
    });
  });
});
