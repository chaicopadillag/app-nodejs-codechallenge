import { InputTransactionType } from './interfaces';

export const transactionMapper = (input: InputTransactionType) => ({
  transactionExternalId: input.id,
  transactionType: {
    name: input.transactionType.name,
  },
  transactionStatus: {
    name: input.status,
  },
  value: input.value.toNumber(),
  createdAt: new Date(input.createdAt),
});
