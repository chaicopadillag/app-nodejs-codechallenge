import { Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { TransactionTypeEntity } from './entities';
import { TransactionTypesService } from './transaction-types.service';

@Resolver(() => TransactionTypeEntity)
export class TransactionTypesResolver {
  constructor(
    private readonly transactionTypesService: TransactionTypesService,
  ) {}

  /**
   * Obtiene todos los tipos de transacciones disponibles.
   *
   * @returns Un array de tipos de transacciones.
   */
  @Query(() => [TransactionTypeEntity], { name: 'transactionTypes' })
  getAll(): Observable<TransactionTypeEntity[]> {
    return this.transactionTypesService.findAllTransactionTypes();
  }
}
