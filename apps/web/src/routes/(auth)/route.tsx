import { createFileRoute, redirect } from '@tanstack/react-router';

import countries from '@/assets/countries.json';
import { trpcClient } from '@/lib/trpc';

export const Route = createFileRoute('/(auth)')({
  beforeLoad: async ({ context }) => {
    if (context.auth?.user) {
      throw redirect({ to: '/' });
    }
    try {
      const response = await trpcClient.auth.me.mutate();

      if (response) {
        const country = countries.find(
          (country) => country.iso2 === response?.countryCode
        );
        context.auth?.setUser({ ...response, country: country || null });
        throw redirect({ to: '/' });
      }
    } catch {
      // throw redirect({ to: '/' });
    }
  },
});
