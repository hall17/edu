import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useClassroomForm } from '../../ClassroomFormContext';

import { IntegrationCard } from './IntegrationCard';

import { Button } from '@/components/ui/button';
import { useClassroomsContext } from '@/features/admin/classrooms/classrooms/ClassroomsContext';
import { trpc } from '@/lib/trpc';

export function IntegrationsStep() {
  const { t } = useTranslation();
  const { currentRow } = useClassroomsContext();
  const { appendIntegration, integrationFields } = useClassroomForm();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            {t('classrooms.actionDialog.integrations.title')}
          </h3>
          <p className="text-muted-foreground text-sm">
            {t('classrooms.actionDialog.integrations.description')}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            appendIntegration({
              id: crypto.randomUUID(),
              classroomId: currentRow?.id || '',
              subjectId: '',
              curriculumId: '',
              teacherId: '',
              schedules: [],
              sessions: [],
            });
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t('classrooms.actionDialog.integrations.addIntegration')}
        </Button>
      </div>

      <div className="space-y-4">
        {integrationFields.map((field, index) => (
          <IntegrationCard key={field.id} index={index} />
        ))}
      </div>
    </div>
  );
}
