import { createFileRoute } from '@tanstack/react-router';

import { LoginCentered } from '@/features/auth/login/Login2';

export const Route = createFileRoute('/(auth)/login-2')({
  component: LoginCentered,
});
