import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { catchError, from, map, tap, throwError } from 'rxjs';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { transactionMapper } from './mappers';
import { TransactionPublisher } from './publishers';
import { TransactionRepository, TransactionTypeRepository } from './repository';
@Injectable()
export class TransactionsService {
  private logger = new Logger(TransactionsService.name);

  constructor(
    private transactionRepository: TransactionRepository,
    private transactionTypeRepository: TransactionTypeRepository,
    private transactionPublisher: TransactionPublisher,
  ) {}

  /**
   * Crea una nueva transacción.
   *
   * @param createTransactionDto - El objeto DTO que contiene los datos necesarios para crear la transacción.
   * @returns Un observable que emite la transacción creada o un error.
   */
  create(createTransactionDto: CreateTransactionDto) {
    return from(this.transactionRepository.create(createTransactionDto)).pipe(
      tap((transaction) =>
        this.transactionPublisher.emit('process_transaction', transaction),
      ),
      map((transaction) =>
        JSON.stringify(transactionMapper(transaction as any)),
      ),
      catchError((error) => {
        this.logger.error('Error: ', error.stack);
        throw throwError(() => 'Error al crear la transacción');
      }),
    );
  }

  /**
   * Actualiza el estado de una transacción existente.
   *
   * @param updateTransactionDto - El objeto DTO que contiene los datos necesarios para actualizar el estado de la transacción.
   * @returns Un observable que emite la transacción actualizada o un error.
   */
  update({ id, status }: UpdateTransactionDto) {
    return from(this.transactionRepository.update({ id, status })).pipe(
      catchError((error) => {
        this.logger.error('Error: ', error.stack);
        throw throwError(() => 'Error al actualizar estado de la transacción');
      }),
    );
  }

  /**
   * Obtiene todas las transacciones existentes.
   *
   * @returns Un observable que emite un array de transacciones.
   */
  findAll() {
    return from(this.transactionRepository.findAll()).pipe(
      map((transactions) =>
        transactions.map((transaction) =>
          transactionMapper(transaction as any),
        ),
      ),
    );
  }

  /**
   * Obtiene una transacción por su ID.
   *
   * @param id - El ID de la transacción a buscar.
   * @returns Un observable que emite la transacción encontrada o un error.
   * @throws {NotFoundException} Si no se encuentra la transacción con el ID proporcionado.
   */
  findById(id: string) {
    return from(this.transactionRepository.findById(id)).pipe(
      map((transaction) => {
        if (!transaction) {
          throw new NotFoundException(
            `The transaction with id ${id} not found`,
          );
        }
        return JSON.stringify(transactionMapper(transaction as any));
      }),
      catchError((e) => {
        this.logger.error(e);
        throw throwError(() => e);
      }),
    );
  }

  /**
   * Obtiene todos los tipos de transacciones existentes.
   *
   * @returns Un observable que emite un array de tipos de transacciones.
   */
  findAllTansferTypes() {
    return from(this.transactionTypeRepository.findAll());
  }
}
