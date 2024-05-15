import { Injectable, OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TransactionPublisher } from '../transactions/publishers';
import { TransactionTypeEntity } from './entities';
@Injectable()
export class TransactionTypesService implements OnModuleInit {
  constructor(private transactionPublish: TransactionPublisher) {}

  /**
   * Método que se ejecuta cuando el módulo ha sido inicializado.
   * Se suscribe a las respuestas de varios topics de Kafka.
   */
  onModuleInit() {
    this.transactionPublish.subscribeToResponse('find_all_transaction_types');
  }

  /**
   * Obtiene todos los tipos de transacciones existentes.
   *
   * @returns Un observable que emite un array de tipos de transacciones.
   */
  findAllTransactionTypes(): Observable<TransactionTypeEntity[]> {
    return this.transactionPublish.send('find_all_transaction_types', {});
  }
}
