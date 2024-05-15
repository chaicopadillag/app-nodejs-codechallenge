import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTransactionInput } from './dto';
import { TransactionEntity } from './entities';
import { TransactionsService } from './transactions.service';

@Resolver(() => TransactionEntity)
export class TransactionsResolver {
  constructor(private transactionService: TransactionsService) {}

  /**
   * Crea una nueva transacción.
   *
   * @param createTransactionInput - El objeto DTO que contiene los datos necesarios para crear la transacción.
   */
  @Mutation(() => TransactionEntity, {
    name: 'createTransaction',
    description: 'Crea una nueva transacción',
  })
  createTransaction(
    @Args('createTransaction', { type: () => CreateTransactionInput })
    createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionService.createTransaction(createTransactionInput);
  }

  /**
   * Obtiene todas las transacciones existentes.
   *
   * @returns Un array de transacciones.
   */
  @Query(() => [TransactionEntity], {
    name: 'transactions',
    description: 'Un array de transacciones',
  })
  getAllTransactions() {
    return this.transactionService.findAllTransactions();
  }

  /**
   * Obtiene una transacción por su ID.
   *
   * @param id - El ID de la transacción a buscar.
   * @returns La transacción encontrada or null.
   */

  @Query(() => TransactionEntity, {
    name: 'transactionById',
    description: 'Obtener una transacción por su ID',
  })
  findTransactionById(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ) {
    return this.transactionService.findTransactionById(id);
  }
}
