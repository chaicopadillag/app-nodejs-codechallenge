import { Decimal } from '@prisma/client/runtime/library';

export type InputTransactionType = {
  id: string;
  status: string;
  value: Decimal;
  transactionType: TransactionType;
  createdAt: Date;
};

type TransactionType = {
  name: string;
};
