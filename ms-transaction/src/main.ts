import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppModule } from './app.module';
import { kafkaConfig } from './config';
import { MS_TRANSACTION, MS_TRANSACTION_CONSUMER } from './transports';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  const config = app.get<ConfigType<typeof kafkaConfig>>(kafkaConfig.KEY);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: config.brokers,
        clientId: MS_TRANSACTION,
      },
      consumer: {
        groupId: MS_TRANSACTION_CONSUMER,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  });
  app.startAllMicroservices();
}

bootstrap();
