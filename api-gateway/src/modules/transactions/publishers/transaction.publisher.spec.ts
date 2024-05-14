import { TRANSPORT_SERVICE } from '@/transports';
import { ClientKafka } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionInput } from '../dto';
import { TransactionPublisher } from './transaction.publisher';

describe('TransactionPublisher', () => {
  let transactionPublisher: TransactionPublisher;
  let clientKafkaMock: Partial<ClientKafka>;

  beforeEach(async () => {
    clientKafkaMock = {
      emit: jest.fn(),
      send: jest.fn(),
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
      const topic = 'find_all_transactions';

      transactionPublisher.emit(topic, {});

      expect(clientKafkaMock.emit).toHaveBeenCalledWith(
        topic,
        JSON.stringify({}),
      );
    });
  });

  describe('send', () => {
    it('should send message with topic and payload', () => {
      const topic = 'create_transaction';

      const payload: CreateTransactionInput = {
        accountExternalIdDebit: '71f8990f-6308-4952-a794-3e1aebc7c250',
        accountExternalIdCredit: '6164fed5-40fb-43fe-acac-37aa6b41da6c',
        transferTypeId: 'bd14d75e-dca3-4129-b0d6-28c746c2d706',
        value: 512,
      };

      transactionPublisher.send(topic, payload);

      expect(clientKafkaMock.send).toHaveBeenCalledWith(
        topic,
        JSON.stringify(payload),
      );
    });
  });
});
