import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app-config', () => ({
  nodeEnv: process.env.NODE_ENV,
}));
