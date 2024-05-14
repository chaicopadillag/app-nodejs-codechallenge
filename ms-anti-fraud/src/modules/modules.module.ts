import { TransactionsModule } from '@/modules/transactions/transactions.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TransactionsModule],
})
export class ModulesModule {}
