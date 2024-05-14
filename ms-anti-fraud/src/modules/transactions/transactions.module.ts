import { transactionConfig } from '@/config';
import { KafkaModule } from '@/transports';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionPublisher } from './publishers';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionValidator } from './validators';

@Module({
  imports: [ConfigModule.forFeature(transactionConfig), KafkaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionValidator, TransactionPublisher],
})
export class TransactionsModule {}
