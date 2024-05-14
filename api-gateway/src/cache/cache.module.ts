import { cacheConfig } from '@/config';
import { CacheModule as CacheModuleNest } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { CacheService } from './cache.service';

@Module({
  imports: [
    ConfigModule.forFeature(cacheConfig),
    CacheModuleNest.registerAsync<RedisClientOptions>({
      imports: [ConfigModule.forFeature(cacheConfig)],
      inject: [cacheConfig.KEY],
      useFactory: async (cache: ConfigType<typeof cacheConfig>) => ({
        store: redisStore,
        host: cache.host,
        port: cache.port,
        ttl: cache.ttl,
      }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheModuleNest, CacheService],
})
export class CacheModule {}
