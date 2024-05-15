import { Decimal } from '@prisma/client/runtime/library';
import { InputTransactionType } from './interfaces';
import { transactionMapper } from './transaction-mapper';

describe('transactionMapper', () => {
  it('should map input transaction to output transaction correctly', () => {
    const input: InputTransactionType = {
      id: '9e9b809e-3d79-4420-bafc-36535ff857d1',
      transactionType: { name: 'Transferencia Bancaria' },
      status: 'Aprobada',
      value: new Decimal(1000),
      createdAt: new Date('2022-05-14T12:00:00.000Z'),
    };

    const expectedOutput = {
      transactionExternalId: '9e9b809e-3d79-4420-bafc-36535ff857d1',
      transactionType: {
        name: 'Transferencia Bancaria',
      },
      transactionStatus: {
        name: 'Aprobada',
      },
      value: 1000,
      createdAt: new Date('2022-05-14T12:00:00.000Z'),
    };
    const output = transactionMapper(input);
    expect(output).toEqual(expectedOutput);
  });
});
