import { createFileRoute, redirect } from '@tanstack/react-router';

import { Materials } from '@/features/materials';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/materials/')({
  component: Materials,
  validateSearch: () => ({}) as RouterInput['curriculum']['findAll'],
});
