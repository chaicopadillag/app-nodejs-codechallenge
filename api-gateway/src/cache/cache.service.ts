import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable, from } from 'rxjs';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  get<T>(key: string): Observable<T> {
    return from(this.cacheManager.get<T>(key));
  }

  set<T>(key: string, value: T) {
    return from(this.cacheManager.set(key, value));
  }
}
