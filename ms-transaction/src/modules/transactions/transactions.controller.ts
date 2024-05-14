import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateTransactionDto } from './dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Crea una nueva transacción.
   *
   * @param createTransactionDto - El objeto DTO que contiene los datos necesarios para crear la transacción.
   */
  @MessagePattern('create_transaction')
  createTransaction(@Payload() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  /**
   * Actualiza el estado de una transacción existente.
   *
   * @param updateTransactionDto - El objeto DTO que contiene los datos necesarios para actualizar el estado de la transacción.
   */
  @MessagePattern('update_transaction_status')
  updateTransactionStatus(
    @Payload() updateTransactionDto: UpdateTransactionDto,
  ) {
    this.transactionsService.update(updateTransactionDto).subscribe();
  }

  /**
   * Obtiene todas las transacciones existentes.
   *
   * @returns Un observable que emite un array de transacciones.
   */
  @MessagePattern('find_all_transactions')
  findAllTransactions() {
    return this.transactionsService.findAll();
  }

  /**
   * Obtiene una transacción por su ID.
   *
   * @param id - El ID de la transacción a buscar.
   * @returns Un observable que emite la transacción encontrada.
   */
  @MessagePattern('find_transaction_by_id')
  findTransactionById(@Payload('id', ParseUUIDPipe) id: string) {
    return this.transactionsService.findById(id);
  }

  /**
   * Obtiene todos los tipos de transacciones existentes.
   *
   * @returns Un observable que emite un array de tipos de transacciones.
   */
  @MessagePattern('find_all_transaction_types')
  findAllTransacionTypes() {
    return this.transactionsService.findAllTansferTypes();
  }
}
