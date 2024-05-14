export type OutputTransactionI = {
  transactionExternalId: string;
  transactionType: TransactionType;
  transactionStatus: TransactionType;
  value: number;
  createdAt: Date;
};

type TransactionType = {
  name: string;
};
