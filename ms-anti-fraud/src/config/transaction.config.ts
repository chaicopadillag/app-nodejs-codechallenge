import { registerAs } from '@nestjs/config';

export const transactionConfig = registerAs('transaction-config', () => ({
  maxTransactionValue: Number(process.env.MAX_TRANSACTION_VALUE),
}));
