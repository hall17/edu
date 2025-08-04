import { TokenUser } from './types';

// declare module 'vitest' {
//   export interface TestContext {
//     integration: ReturnType<typeof getSeedData>;
//     foo?: string;
//   }
// }
declare global {
  interface File {
    buffer: Buffer;
  }
}
