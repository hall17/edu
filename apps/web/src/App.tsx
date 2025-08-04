import { createRouter, RouterProvider } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { en, tr } from 'zod/locales';

import { FontProvider } from './context/FontContext';
import { ThemeProvider } from './context/ThemeContext';
import { createCustomZodErrorMessage } from './hooks/createCustomZodErrorMessage.';
import { queryClient } from './lib/trpc';
// Generated Routes
import { routeTree } from './routeTree.gen';
import { useAuthStore } from './stores/authStore';
import { TRPCProvider } from './TRPCProvider';

import 'dayjs/locale/tr';
import 'dayjs/locale/en';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: (failureCount, error) => {
//         // eslint-disable-next-line no-console
//         if (import.meta.env.DEV) console.log({ failureCount, error });

//         if (failureCount >= 0 && import.meta.env.DEV) return false;
//         if (failureCount > 3 && import.meta.env.PROD) return false;

//         return !(error instanceof AxiosError && [401, 403].includes(error.response?.status ?? 0));
//       },
//       refetchOnWindowFocus: import.meta.env.PROD,
//       staleTime: 10 * 1000, // 10s
//     },
//     mutations: {
//       onError: (error) => {
//         // handleServerError(error);

//         if (error instanceof AxiosError) {
//           if (error.response?.status === 304) {
//             // toast({
//             //   variant: 'destructive',
//             //   title: 'Content not modified!',
//             // });
//           }
//         }
//       },
//     },
//   },
//   queryCache: new QueryCache({
//     onError: (error) => {
//       if (error instanceof AxiosError) {
//         if (error.response?.status === 401) {
//           // toast({
//           //   variant: 'destructive',
//           //   title: 'Session expired!',
//           // });
//           // useAuthStore.getState().auth.reset();
//           // const redirect = `${router.history.location.href}`;
//           // router.navigate({ to: '/login', search: { redirect } });
//         }
//         if (error.response?.status === 500) {
//           // toast({
//           //   variant: 'destructive',
//           //   title: 'Internal Server Error!',
//           // });
//           // router.navigate({ to: '/500' });
//         }
//         if (error.response?.status === 403) {
//           // router.navigate("/forbidden", { replace: true });
//         }
//       }
//     },
//   }),
// });

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient, auth: undefined! },
  // prelo
  // defaultPreload: 'intent',
  // defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const auth = useAuthStore((state) => state.auth);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const language = auth?.user?.preferences?.language?.toLowerCase() ?? 'tr';
    dayjs.locale(language);

    z.config({
      customError: (iss) => {
        return createCustomZodErrorMessage(iss as z.core.$ZodIssue, t);
      },
    });
  }, [auth?.user?.preferences?.language]);

  return (
    <TRPCProvider>
      <ThemeProvider>
        <FontProvider>
          <RouterProvider router={router} context={{ auth }} />
        </FontProvider>
      </ThemeProvider>
    </TRPCProvider>
  );
}
