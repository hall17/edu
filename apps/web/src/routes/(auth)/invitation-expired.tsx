import { createFileRoute } from '@tanstack/react-router';

import { InvitationExpired } from '@/features/auth/invitation-expired';

export const Route = createFileRoute('/(auth)/invitation-expired')({
  component: InvitationExpired,
});
