import { createFileRoute } from '@tanstack/react-router';

import { SettingsInventory } from '@/features/admin/settings/inventory/Inventory';
import { RouterInput } from '@/lib/trpc';

export const Route = createFileRoute('/_authenticated/settings/inventory')({
  component: SettingsInventory,
  validateSearch: () => ({}) as RouterInput['device']['findMyDevices'],
});
