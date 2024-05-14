import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppModule } from './app.module';
import { kafkaConfig } from './config';
import { MS_ANTI_FRAUD, MS_ANTI_FRAUD_CONSUMER } from './transports';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const kafka = app.get<ConfigType<typeof kafkaConfig>>(kafkaConfig.KEY);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: kafka.brokers,
        clientId: MS_ANTI_FRAUD,
      },
      consumer: {
        groupId: MS_ANTI_FRAUD_CONSUMER,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  });
  app.startAllMicroservices();
}
bootstrap();
