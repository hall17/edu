import { createFileRoute } from '@tanstack/react-router';

import { MaintenanceError } from '@/features/errors/MaintenanceError';

export const Route = createFileRoute('/(errors)/503')({
  component: MaintenanceError,
});
