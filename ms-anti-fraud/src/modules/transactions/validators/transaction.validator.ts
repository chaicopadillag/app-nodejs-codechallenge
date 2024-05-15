import { transactionConfig } from '@/config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TransferStatus } from '../types';

@Injectable()
export class TransactionValidator {
  /**
   * Constructor del servicio TransactionValidator.
   *
   * @param config - La configuración de la transacción que contiene el valor máximo permitido.
   */
  constructor(
    @Inject(transactionConfig.KEY)
    private transferConfig: ConfigType<typeof transactionConfig>,
  ) {}

  /**
   * Valida el valor de una transacción.
   *
   * @param value - El valor de la transacción a validar.
   * @returns El estado de la transacción (`approved` o `rejected`).
   *
   * Si el valor de la transacción es mayor que el valor máximo permitido,
   * devuelve el estado `rejected`. De lo contrario, devuelve el estado `approved`.
   */
  validate(value: number): TransferStatus {
    return Number(value) > this.transferConfig.maxTransactionValue
      ? TransferStatus.rejected
      : TransferStatus.approved;
  }
}
