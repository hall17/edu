import { TokenUser } from './types';

declare global {
  namespace Express {
    interface Request {
      // define your own types here
      user: TokenUser;
    }
  }
}

// declare module 'vitest' {
//   export interface TestContext {
//     integration: ReturnType<typeof getSeedData>;
//     foo?: string;
//   }
// }
