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

export function ClassroomCalendarInformationForm() {
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
  console.log('form values', form.getValues());
  return (
    <div className="rounded-lg border p-4">
      <h4 className="mb-2 font-medium">
        {t('classrooms.calendar.actionDialog.sessionInformation')}
      </h4>
      <div className="grid grid-cols-2 items-start gap-4">
        <FormField
          control={form.control}
          name="classroomIntegrationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t(
                  'classrooms.calendar.actionDialog.classroomIntegrationLabel'
                )}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        'classrooms.calendar.actionDialog.classroomIntegrationPlaceholder'
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {integrations?.map((integration) => (
                    <SelectItem key={integration.id} value={integration.id}>
                      {integration.subject?.name} -{' '}
                      {integration.teacher?.firstName}{' '}
                      {integration.teacher?.lastName}
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
              <FormLabel>
                {t('classrooms.calendar.actionDialog.teacherLabel')}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
                disabled
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        'classrooms.calendar.actionDialog.teacherPlaceholder'
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classroom?.integrations
                    ?.filter((integration) => integration.teacher)
                    .map((integration) => (
                      <SelectItem
                        key={integration.teacher!.id}
                        value={integration.teacher!.id}
                      >
                        {integration.teacher!.firstName}{' '}
                        {integration.teacher!.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 items-start gap-4">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('classrooms.calendar.actionDialog.startDateLabel')}
              </FormLabel>
              <FormControl>
                <DateTimePicker24h
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  placeholder={t(
                    'classrooms.calendar.actionDialog.startDatePlaceholder'
                  )}
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
              <FormLabel>
                {t('classrooms.calendar.actionDialog.endDateLabel')}
              </FormLabel>
              <FormControl>
                <DateTimePicker24h
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  placeholder={t(
                    'classrooms.calendar.actionDialog.endDatePlaceholder'
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 items-start gap-4">
        <FormField
          control={form.control}
          name="lessonIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('classrooms.calendar.actionDialog.lessonLabel')}
              </FormLabel>
              <FormControl>
                <MultiSelect
                  options={
                    selectedClassroomIntegration?.curriculum?.lessons?.map(
                      (lesson) => ({
                        label: lesson.name,
                        value: lesson.id,
                      })
                    ) ?? []
                  }
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder={t(
                    'classrooms.calendar.actionDialog.lessonPlaceholder'
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('classrooms.calendar.actionDialog.descriptionLabel')}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder={t(
                  'classrooms.calendar.actionDialog.descriptionPlaceholder'
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
