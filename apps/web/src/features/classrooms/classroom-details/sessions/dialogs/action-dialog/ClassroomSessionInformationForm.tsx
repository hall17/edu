import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useClassroomSessionForm } from '../../../../../../context/ClassroomSessionFormContext';

import { DateTimePicker24h } from '@/components/DateTimePicker24h';
import { MultiSelect } from '@/components/MultiSelect';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ClassroomSessionInformationForm() {
  const { form, classroom } = useClassroomSessionForm();
  const { t } = useTranslation();
  const integrations = classroom?.integrations ?? [];
  console.log('classroom', classroom);
  const watchedClassroomIntegrationId = form.watch('classroomIntegrationId');

  const selectedClassroomIntegration = useMemo(() => {
    const integration = integrations?.find(
      (integration) => integration.id === watchedClassroomIntegrationId
    );

    // Set teacherId to the teacher of the selected integration
    form.setValue('teacherId', integration?.teacherId || '');

    return integration;
  }, [watchedClassroomIntegrationId, classroom?.integrations]);

  return (
    <div className="rounded-lg border p-4">
      <h4 className="mb-2 font-medium">
        {t('sessions.createDialog.sessionInformation')}
      </h4>
      <div className="grid grid-cols-2 items-start gap-4">
        <FormField
          control={form.control}
          name="classroomIntegrationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('sessions.createDialog.classroomIntegrationLabel')}
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        'sessions.createDialog.classroomIntegrationPlaceholder'
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {integrations?.map((integration) => (
                    <SelectItem key={integration.id} value={integration.id}>
                      {integration.subject?.name} -{' '}
                      {integration.curriculum?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('sessions.createDialog.teacherLabel')}
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        'sessions.createDialog.teacherPlaceholder'
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedClassroomIntegration?.subject?.teachers.map(
                    ({ teacher }) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lessonIds"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{t('sessions.createDialog.lessonLabel')}</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={
                      selectedClassroomIntegration?.curriculum?.lessons.map(
                        (lesson) => ({
                          label: lesson.name,
                          value: lesson.id,
                        })
                      ) || []
                    }
                    defaultValue={field.value || []}
                    onValueChange={field.onChange}
                    placeholder={t('sessions.createDialog.lessonPlaceholder')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('sessions.createDialog.descriptionLabel')}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t(
                    'sessions.createDialog.descriptionPlaceholder'
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('sessions.createDialog.startDateLabel')}
              </FormLabel>
              <FormControl>
                <DateTimePicker24h
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString())}
                  placeholder={t('sessions.createDialog.startDatePlaceholder')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('sessions.createDialog.endDateLabel')}
              </FormLabel>
              <FormControl>
                <DateTimePicker24h
                  placeholder={t('sessions.createDialog.endDatePlaceholder')}
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
