import { createFileRoute } from '@tanstack/react-router';

import { MaintenanceError } from '@/features/shared/errors/MaintenanceError';

export const Route = createFileRoute('/(errors)/503')({
  component: MaintenanceError,
});
