import { kafkaConfig } from '@/config';
import {
  API_GATEWAY,
  API_GATEWAY_CONSUMER,
  TRANSPORT_SERVICE,
} from '@/transports';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    ConfigModule.forFeature(kafkaConfig),
    ClientsModule.registerAsync([
      {
        name: TRANSPORT_SERVICE,
        imports: [ConfigModule.forFeature(kafkaConfig)],
        inject: [kafkaConfig.KEY],
        useFactory: (kafka: ConfigType<typeof kafkaConfig>) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: API_GATEWAY,
              brokers: kafka.brokers,
            },
            consumer: {
              groupId: API_GATEWAY_CONSUMER,
            },
            producer: {
              createPartitioner: Partitioners.LegacyPartitioner,
            },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
