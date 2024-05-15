import { Injectable } from '@nestjs/common';
import { TransactionPublisher } from './publishers';
import { TransactionPublishType, TransactionType } from './types';
import { TransactionValidator } from './validators';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionValidator: TransactionValidator,
    private readonly transactionPublisher: TransactionPublisher,
  ) {}

  /**
   * Procesa una transacción y emite su estado actualizado.
   *
   * @param transaction - La transacción a procesar.
   *
   * Este método realiza las siguientes acciones:
   *
   * 1. Valida el valor de la transacción utilizando el validador de transacciones.
   * 2. Crea un objeto `TransactionPublishType` con el ID de la transacción y el estado actualizado.
   * 3. Publica el objeto `TransactionPublishType` utilizando el publicador de transacciones.
   */
  processTransaction(transaction: TransactionType) {
    const status = this.transactionValidator.validate(transaction.value);

    const updatedTransaction: TransactionPublishType = {
      id: transaction.id,
      status,
    };

    this.transactionPublisher.emit(
      'update_transaction_status',
      updatedTransaction,
    );
  }
}
