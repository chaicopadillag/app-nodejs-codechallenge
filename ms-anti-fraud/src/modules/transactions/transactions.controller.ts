import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
import { TransactionType } from './types';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @MessagePattern('process_transaction')
  processTransaction(@Payload() payload: TransactionType) {
    this.transactionService.processTransaction(payload);
  }
}
