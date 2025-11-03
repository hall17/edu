import { AttendanceStatus } from '@edusama/server';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { detailedDiff } from 'deep-object-diff';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import z from 'zod';

import { useClassroomForm } from '../../ClassroomFormContext';

import { MultiSelect, UnsavedChangesDialog } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
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
import { ClassroomSessionFormProvider } from '@/context/ClassroomSessionFormContext';
import { ClassroomSessionInformationForm } from '@/features/classrooms/classroom-details/sessions/dialogs/action-dialog/ClassroomSessionInformationForm';
import {
  type ClassroomSessionFormData,
  classroomSessionFormSchema,
} from '@/lib/schemas/classroomSessionFormSchema';
import { ClassroomFromFindOne, ClassroomIntegrationSession } from '@/lib/trpc';

const formSchema = z.object({
  teacherId: z.string().min(1),
  description: z.string().optional(),
  lessonIds: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  event: ClassroomIntegrationSession;
  onClose: () => void;
}
export function CalendarEventDialog(props: Props) {
  const { event, onClose } = props;
  const { t } = useTranslation();
  const {
    form: classroomForm,
    watchedIntegrations,
    subjects,
  } = useClassroomForm();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const classroom = classroomForm.getValues();

  const integration = watchedIntegrations.find(
    (integration) => integration.id === props.event.classroomIntegrationId
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teacherId: event.teacherId || '',
      lessonIds: event.lessons?.map((lesson) => lesson.lesson.id) || [],
      description: event.description || '',
    },
    mode: 'onSubmit',
  });

  const selectedClassroomIntegration = useMemo(() => {
    const integrations = classroom.integrations.map((integration) => {
      const subject = subjects.find(
        (subject) => subject.id === integration.subjectId
      );
      const curriculum = subject?.curriculums.find(
        (curriculum) => curriculum.id === integration.curriculumId
      );

      return {
        ...integration,
        subject: subject,
        curriculum: curriculum,
      };
    });

    const integration = integrations?.find(
      (integration) => integration.id === event.classroomIntegrationId
    );

    return integration;
  }, [classroom]);

  function onSubmit(data: FormData) {
    const integrationIndex = classroom.integrations.findIndex(
      (integration) => integration.id === event.classroomIntegrationId
    );
    const sessionIndex = classroom.integrations[
      integrationIndex
    ].sessions.findIndex((session) => session.id === event.id);

    if (integrationIndex === -1 || sessionIndex === -1) {
      return;
    }

    classroomForm.setValue(
      `integrations.${integrationIndex}.sessions.${sessionIndex}.teacherId`,
      data.teacherId
    );
    classroomForm.setValue(
      `integrations.${integrationIndex}.sessions.${sessionIndex}.lessonIds`,
      data.lessonIds
    );
    classroomForm.setValue(
      `integrations.${integrationIndex}.sessions.${sessionIndex}.description`,
      data.description
    );
    onClose();
  }

  function handleDialogClose(state: boolean) {
    let isDirty = false;

    if (form.formState.defaultValues) {
      const diff = detailedDiff(form.formState.defaultValues, form.getValues());
      isDirty =
        Object.keys(diff.updated).length > 0 ||
        Object.keys(diff.added).length > 0 ||
        Object.keys(diff.deleted).length > 0;
    }

    if (!state && isDirty) {
      // User is trying to close and form is dirty
      setShowConfirmDialog(true);
    } else {
      // Safe to close
      handleConfirmClose();
    }
  }

  function handleConfirmClose() {
    setShowConfirmDialog(false);
    onClose();
    form.reset();
  }

  function handleCancelClose() {
    setShowConfirmDialog(false);
  }

  return (
    <>
      <Dialog open={!!event} onOpenChange={handleDialogClose}>
        <DialogContent className="min-w-[60vw]">
          <DialogHeader>
            <DialogTitle>{t('sessions.createDialog.editTitle')}</DialogTitle>
            <DialogDescription>
              {event && (
                <>
                  {dayjs(event.startDate).format('DD/MM/YYYY HH:mm')} -{' '}
                  {dayjs(event.endDate).format('HH:mm')}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              id="session-form"
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log('errors', errors);
              })}
              className="space-y-4"
            >
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
                      <FormLabel>
                        {t('sessions.createDialog.lessonLabel')}
                      </FormLabel>
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
                          placeholder={t(
                            'sessions.createDialog.lessonPlaceholder'
                          )}
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
            </form>
          </Form>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleConfirmClose}
            >
              {t('sessions.createDialog.cancel')}
            </Button>
            <Button type="submit" form="session-form">
              {t('sessions.createDialog.update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <UnsavedChangesDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </>
  );
}
