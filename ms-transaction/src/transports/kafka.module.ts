import { kafkaConfig } from '@/config';
import {
  MS_TRANSACTION,
  MS_TRANSACTION_CONSUMER,
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
        useFactory: (kafka: ConfigType<typeof kafkaConfig>) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: MS_TRANSACTION,
                brokers: kafka.brokers,
              },
              consumer: {
                groupId: MS_TRANSACTION_CONSUMER,
              },
              producer: {
                createPartitioner: Partitioners.LegacyPartitioner,
              },
            },
          };
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
