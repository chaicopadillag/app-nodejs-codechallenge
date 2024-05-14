import { CacheService } from '@/cache';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { CreateTransactionInput } from './dto';
import { TransactionEntity } from './entities';
import { TransactionPublisher } from './publishers';

@Injectable()
export class TransactionsService implements OnModuleInit {
  constructor(
    private transactionPublish: TransactionPublisher,
    private cacheService: CacheService,
  ) {}

  /**
   * Método que se ejecuta cuando el módulo ha sido inicializado.
   * Se suscribe a las respuestas de varios topics de Kafka.
   */
  onModuleInit() {
    this.transactionPublish.subscribeToResponse('find_all_transactions');
    this.transactionPublish.subscribeToResponse('find_transaction_by_id');
    this.transactionPublish.subscribeToResponse('create_transaction');
  }

  /**
   * Crea una nueva transacción.
   *
   * @param transactionInput - El objeto DTO que contiene los datos necesarios para crear la transacción.
   * @returns Un observable que emite la respuesta del servidor después de crear la transacción.
   */
  createTransaction(transactionInput: CreateTransactionInput) {
    return this.transactionPublish.send('create_transaction', transactionInput);
  }

  /**
   * Obtiene todas las transacciones existentes.
   *
   * @returns Un observable que emite un array de transacciones.
   */
  findAllTransactions() {
    return this.transactionPublish.send('find_all_transactions', {});
  }

  /**
   * Obtiene una transacción por su ID del cache si existe.
   *
   * @param id - El ID de la transacción a buscar.
   * @returns Un observable que emite la transacción encontrada.
   */
  findTransactionById(id: string): Observable<TransactionEntity> {
    return this.getFromCache(id).pipe(
      switchMap((cachedTransaction) =>
        cachedTransaction
          ? of(cachedTransaction)
          : this.getFromSourceAndCache(id),
      ),
    );
  }

  private getFromCache(id: string): Observable<TransactionEntity> {
    return this.cacheService.get<TransactionEntity>(id);
  }

  /**
   * Obtiene una transacción por su ID y guarda en cache.
   *
   * @param id - El ID de la transacción a buscar.
   * @returns Un observable que emite la transacción encontrada.
   */
  private getFromSourceAndCache(id: string): Observable<TransactionEntity> {
    const payload = { id };
    return this.transactionPublish
      .send<TransactionEntity>('find_transaction_by_id', payload)
      .pipe(
        tap((transaction) =>
          this.cacheService.set(transaction.transactionExternalId, transaction),
        ),
        catchError(() => of(null)),
      );
  }
}
