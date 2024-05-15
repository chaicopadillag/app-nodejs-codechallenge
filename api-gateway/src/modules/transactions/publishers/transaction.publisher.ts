import { TRANSPORT_SERVICE } from '@/transports';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class TransactionPublisher {
  constructor(
    @Inject(TRANSPORT_SERVICE) private transportClient: ClientKafka,
  ) {}

  /**
   * Suscribe al cliente de transporte para recibir respuestas de un tema específico.
   *
   * @param topic - El tema del cual se recibirán las respuestas.
   */
  subscribeToResponse(topic: string) {
    this.transportClient.subscribeToResponseOf(topic);
  }

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

  /**
   * Envía un mensaje a un tema específico y espera una respuesta.
   *
   * @param topic - El tema al que se enviará el mensaje.
   * @param payload - El contenido del mensaje a enviar.
   * @returns Un observable que emite la respuesta recibida del tema.
   *
   * Este método serializa el payload como una cadena JSON y luego lo envía al tema
   * especificado utilizando el cliente de transporte (Kafka) proporcionado. Después,
   * devuelve un observable que emite la respuesta recibida del tema.
   */

  send<T>(topic: string, payload: any): Observable<T> {
    return this.transportClient.send(topic, JSON.stringify(payload));
  }
}
