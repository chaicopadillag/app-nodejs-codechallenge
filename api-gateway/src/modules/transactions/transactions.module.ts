import { CacheModule, CacheService } from '@/cache';
import { KafkaModule } from '@/transports';
import { Module } from '@nestjs/common';
import { TransactionPublisher } from './publishers';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [CacheModule, KafkaModule],
  providers: [
    TransactionsService,
    TransactionPublisher,
    TransactionsResolver,
    CacheService,
  ],
})
export class TransactionsModule {}
