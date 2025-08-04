import { QueryClient } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { NavigationProgress } from '@/components/NavigationProgress';
import { Toaster } from '@/components/ui/sonner';
import { GeneralError } from '@/features/errors/GeneralError';
import { NotFoundError } from '@/features/errors/NotFoundError';
import { AuthState } from '@/stores/authStore';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth?: AuthState['auth'];
}>()({
  component: () => {
    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Toaster duration={3000} />
        {import.meta.env.MODE === 'development' && (
          <>
            {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
            {/* <TanStackRouterDevtools position="bottom-right" /> */}
          </>
        )}
      </>
    );
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
});
