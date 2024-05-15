import { TRANSPORT_SERVICE } from '@/transports';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TransactionPublisher {
  /**
   * Constructor del servicio TransactionPublisher.
   *
   * @param transportClient - El cliente de transporte (Kafka) utilizado para publicar mensajes.
   */
  constructor(
    @Inject(TRANSPORT_SERVICE) private transportClient: ClientKafka,
  ) {}

  /**
   * Publica un mensaje en un tema específico.
   *
   * @param topic - El tema en el que se publicará el mensaje.
   * @param payload - El contenido del mensaje a publicar.
   *
   * Este método serializa el payload como una cadena JSON y luego lo publica en el tema
   * especificado utilizando el cliente de transporte (Kafka) proporcionado.
   */
  emit<T, M>(topic: T, payload: M) {
    this.transportClient.emit(topic, JSON.stringify(payload));
  }
}
