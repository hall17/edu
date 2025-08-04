import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './lib/trpc';
// import { tsr } from './lib/tsr';

export function TRPCProvider(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      {/* <tsr.ReactQueryProvider>{props.children}</tsr.ReactQueryProvider> */}
    </QueryClientProvider>
  );
}
