import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormData } from '../ClassroomsActionDialog';

import { IntegrationCard } from './IntegrationCard';

import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { useClassroomsContext } from '@/features/classrooms/classrooms/ClassroomsContext';
import { trpc } from '@/lib/trpc';

interface IntegrationsTabProps {
  form: UseFormReturn<FormData>;
  appendIntegration: (integration: FormData['integrations'][number]) => void;
  handleRemoveIntegration: (index: number) => void;
}

export function IntegrationsTab({
  form,
  appendIntegration,
  handleRemoveIntegration,
}: IntegrationsTabProps) {
  const { t } = useTranslation();
  const { currentRow } = useClassroomsContext();

  const subjectsQuery = useQuery(
    trpc.subject.findAll.queryOptions({ all: true })
  );

  const watchedIntegrations = form.watch('integrations');
  // Get all selected subject IDs from existing integrations
  const selectedSubjectIds = watchedIntegrations.map(
    (integration) => integration.subjectId
  );

  return (
    <TabsContent value="integrations" className="space-y-4">
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
                classroomId: currentRow?.id || '',
                subjectId: '',
                curriculumId: '',
                teacherId: null,
                schedules: [],
              });
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            {t('classrooms.actionDialog.integrations.addIntegration')}
          </Button>
        </div>

        <div className="space-y-6">
          {watchedIntegrations.map((field, index) => (
            <IntegrationCard
              key={field.id}
              index={index}
              form={form}
              subjects={subjectsQuery.data?.subjects || []}
              selectedSubjectIds={selectedSubjectIds}
              onRemove={() => handleRemoveIntegration(index)}
              canRemove={watchedIntegrations.length > 1}
              isLoading={subjectsQuery.isLoading}
            />
          ))}
        </div>
      </div>
    </TabsContent>
  );
}
