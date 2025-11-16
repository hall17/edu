import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

import countries from '@/assets/countries.json';
import { AdminLayout, StudentLayout } from '@/features/shared/layouts';
import { trpcClient } from '@/lib/trpc';
import { useAuth } from '@/stores/authStore';

function DynamicLayout() {
  // Access the user from route context or auth store
  const { user } = useAuth();

  // Render appropriate layout based on user type
  if (user?.userType === 'student') {
    return <StudentLayout />;
  }

  return <AdminLayout />;
}

export const Route = createFileRoute('/_authenticated')({
  component: DynamicLayout,
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
        // Return updated context so it's available in the component
        return {
          auth: context.auth,
        };
      }
    } catch (error) {
      // If it's a redirect error, re-throw it
      if (error && typeof error === 'object' && 'redirect' in error) {
        throw error;
      }
    }

    const pathName = location.pathname;

    throw redirect({
      to: '/login',
      search: {
        redirect: pathName === '/' ? undefined : pathName,
      },
    });
  },
});
