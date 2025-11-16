import { createFileRoute } from '@tanstack/react-router';

import { SettingsNotifications } from '@/features/admin/settings/notifications';

export const Route = createFileRoute('/_authenticated/settings/notifications')({
  component: SettingsNotifications,
});
