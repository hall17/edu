import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

import { Invitation } from '@/features/auth/invitation';
import { trpcClient } from '@/lib/trpc';
import { InvitedStudentWithData } from '@/stores/authStore';

const invitationSearchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute('/(auth)/invitation')({
  component: Invitation,
  validateSearch: invitationSearchSchema,
  beforeLoad: async ({ context, search }) => {
    const { token } = search;

    if (!token) {
      throw redirect({ to: '/invitation-expired' });
    }

    try {
      // Verify the token with the server
      const response = await trpcClient.auth.verifyToken.mutate({
        token,
        type: 'INVITATION',
      });

      context.auth?.setStudent(response as InvitedStudentWithData);
      return response as InvitedStudentWithData;
      // Token is valid, proceed to the component
    } catch (error) {
      // Token is invalid or expired, redirect to error page
      throw redirect({ to: '/invitation-expired' });
    }
  },
});
