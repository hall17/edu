import { createFileRoute } from '@tanstack/react-router';

import { SettingsSecurity } from '@/features/admin/settings/security/Security';

export const Route = createFileRoute('/_authenticated/settings/security')({
  component: SettingsSecurity,
});
