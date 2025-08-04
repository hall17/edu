import { createCache } from 'cache-manager';

export const cacheManager = createCache({
  // max: 1000,
  ttl: 2 * 60 * 1000 /*milliseconds*/,
});
