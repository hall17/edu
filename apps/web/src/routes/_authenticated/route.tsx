import { createFileRoute, redirect } from '@tanstack/react-router';

import countries from '@/assets/countries.json';
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import { trpcClient } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async ({ context }) => {
    try {
      if (context.auth?.user) {
        return;
      }
      const response = await trpcClient.auth.me.mutate();

      const country = countries.find(
        (country) => country.iso2 === response?.countryCode
      );

      if (response) {
        context.auth?.setUser({ ...response, country: country || null });
        return;
      }
    } catch {}

    const pathName = location.pathname;

    throw redirect({
      to: '/login',
      search: {
        redirect: pathName === '/' ? undefined : pathName,
      },
    });
  },
});
