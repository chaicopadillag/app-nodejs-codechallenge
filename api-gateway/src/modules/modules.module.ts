import { TransactionTypesModule } from '@/modules/transaction-types';
import { TransactionsModule } from '@/modules/transactions/transactions.module';
import { Module } from '@nestjs/common';
@Module({
  imports: [TransactionsModule, TransactionTypesModule],
})
export class ModulesModule {}
