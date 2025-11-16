import { createFileRoute } from '@tanstack/react-router';

import { SettingsDisplay } from '@/features/admin/settings/display';

export const Route = createFileRoute('/_authenticated/settings/display')({
  component: SettingsDisplay,
});
