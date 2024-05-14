import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app-config', () => ({
  nodeEnv: process.env.NODE_ENV,
  host: process.env.HOST,
  port: Number(process.env.PORT),
}));
