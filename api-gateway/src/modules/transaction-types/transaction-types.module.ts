import { KafkaModule } from '@/transports';
import { Module } from '@nestjs/common';
import { TransactionPublisher } from '../transactions/publishers';
import { TransactionTypesResolver } from './transaction-types.resolver';
import { TransactionTypesService } from './transaction-types.service';

@Module({
  imports: [KafkaModule],
  providers: [
    TransactionTypesService,
    TransactionPublisher,
    TransactionTypesResolver,
  ],
})
export class TransactionTypesModule {}
