import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useClassroomSessionForm } from '../../../../../../context/ClassroomSessionFormContext';

import { DateTimePicker24h } from '@/components/DateTimePicker24h';
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectItem,
} from '@/components/multi-select';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';

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

  const lessons = useMemo(() => {
    return (
      selectedClassroomIntegration?.curriculum?.units.flatMap(
        (unit) => unit.lessons
      ) ?? []
    );
  }, [selectedClassroomIntegration?.curriculum]);

  const teachersQuery = useQuery(
    trpc.user.findAll.queryOptions(
      {
        taughtSubjectIds: [selectedClassroomIntegration?.subjectId!],
      },
      {
        enabled: !!selectedClassroomIntegration?.subjectId,
      }
    )
  );

  const teachers = teachersQuery?.data?.users ?? [];

  return (
    <Card className="rounded-lg border p-4">
      <CardHeader>
        <CardTitle>
          {t('classrooms.calendar.actionDialog.sessionInformation')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
                      <SelectTrigger className="w-full">
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
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t(
                            'classrooms.calendar.actionDialog.teacherPlaceholder'
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.firstName} {teacher.lastName}
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
                <FormItem className="col-span-2">
                  <FormLabel>
                    {t('classrooms.calendar.actionDialog.lessonLabel')}
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      defaultValues={field.value as string[]}
                      onValuesChange={field.onChange}
                    >
                      <MultiSelectTrigger className="h-9 w-full">
                        <MultiSelectValue
                          placeholder={t(
                            'classrooms.calendar.actionDialog.lessonPlaceholder'
                          )}
                        />
                      </MultiSelectTrigger>
                      <MultiSelectContent>
                        {lessons?.map((lesson) => (
                          <MultiSelectItem key={lesson.id} value={lesson.id}>
                            {lesson.name}
                          </MultiSelectItem>
                        ))}
                      </MultiSelectContent>
                    </MultiSelect>
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
                  <Textarea
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
      </CardContent>
    </Card>
  );
}
