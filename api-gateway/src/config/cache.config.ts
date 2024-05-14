import { registerAs } from '@nestjs/config';

export const cacheConfig = registerAs('cache-config', () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  ttl: Number(process.env.REDIS_TTL),
}));
