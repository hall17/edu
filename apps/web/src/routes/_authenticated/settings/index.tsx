import { createFileRoute } from '@tanstack/react-router';

import { SettingsProfile } from '@/features/settings/profile/Profile';

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsProfile,
});
