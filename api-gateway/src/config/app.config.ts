import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app-config', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  apiPrefix: process.env.API_PREFIX,
  allowedOrigins: process.env.ALLOWED_ORIGINS,
}));
