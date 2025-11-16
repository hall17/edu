import { createFileRoute, redirect } from '@tanstack/react-router';

import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/materials/')({
  component: () => <div>Materials</div>,
  validateSearch: () => ({}) as RouterInput['curriculum']['findAll'],
});
