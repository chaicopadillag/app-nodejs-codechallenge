import { PrismaModule } from '@/prisma';
import { KafkaModule } from '@/transports';
import { Module } from '@nestjs/common';
import { TransactionPublisher } from './publishers';
import { TransactionRepository, TransactionTypeRepository } from './repository';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [KafkaModule, PrismaModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionRepository,
    TransactionTypeRepository,
    TransactionPublisher,
  ],
})
export class TransactionsModule {}
