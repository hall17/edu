import { getSeedData } from '@api/prisma/getSeedData';
import { app } from '@api/server';
import { Express } from 'express';
import { beforeEach, TestContext } from 'vitest';

declare module 'vitest' {
  export interface TestContext {
    integration: {
      seedData: ReturnType<typeof getSeedData>;
      app: Express;
    };
  }
}

beforeEach<TestContext>(async (ctx) => {
  ctx.integration = {
    seedData: getSeedData(),
    app: app,
  };
});
