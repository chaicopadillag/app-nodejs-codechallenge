import { registerAs } from '@nestjs/config';

export const kafkaConfig = registerAs('kafka-config', () => ({
  brokers: process.env.KAFKA_BROKERS.split(','),
}));
