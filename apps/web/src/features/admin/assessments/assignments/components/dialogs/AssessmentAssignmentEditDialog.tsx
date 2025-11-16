import {
  classroomIntegrationAssessmentUpdateSchema,
  ClassroomIntegrationAssessmentUpdateDto,
} from '@edusama/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useAssessmentAssignmentsContext } from '../../AssessmentAssignmentsContext';

import { DateTimePicker24h } from '@/components/DateTimePicker24h';
import { LoadingButton } from '@/components/LoadingButton';
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
import { ClassroomIntegrationAssessment, trpc } from '@/lib/trpc';

export function AssessmentAssignmentEditDialog() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog, updateAssignment, assignmentsQuery } =
    useAssessmentAssignmentsContext();

  const defaultValues = useMemo(() => {
    if (currentRow) {
      return {
        id: currentRow.id,
        startDate: currentRow.startDate
          ? new Date(currentRow.startDate)
          : undefined,
        endDate: currentRow.endDate ? new Date(currentRow.endDate) : undefined,
      };
    }
    return {
      id: '',
      startDate: undefined,
      endDate: undefined,
    };
  }, [currentRow]);

  const form = useForm<ClassroomIntegrationAssessmentUpdateDto>({
    resolver: zodResolver(classroomIntegrationAssessmentUpdateSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const updateMutation = useMutation(
    trpc.assessment.updateClassroomIntegrationAssessment.mutationOptions({
      onSuccess: (data) => {
        toast.success(t('assessments.assigned.editDialog.success'));
        updateAssignment(data as ClassroomIntegrationAssessment);
        assignmentsQuery.refetch();
        setOpenedDialog(null);
      },
      onError: () => {
        toast.error(t('assessments.assigned.editDialog.error'));
      },
    })
  );

  function onSubmit(data: ClassroomIntegrationAssessmentUpdateDto) {
    updateMutation.mutate(data);
  }

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {t('assessments.assigned.editDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {t('assessments.assigned.editDialog.description', {
              assessment: currentRow?.assessment?.title,
              classroom: currentRow?.classroomIntegration?.classroom?.name,
            })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      {t('assessments.assignmentForm.startDate')}
                    </FormLabel>
                    <FormControl>
                      <DateTimePicker24h
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t(
                          'assessments.assignmentForm.startDatePlaceholder'
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
                    <FormLabel required>
                      {t('assessments.assignmentForm.endDate')}
                    </FormLabel>
                    <FormControl>
                      <DateTimePicker24h
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t(
                          'assessments.assignmentForm.endDatePlaceholder'
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenedDialog(null)}
              >
                {t('common.cancel')}
              </Button>
              <LoadingButton type="submit" isLoading={updateMutation.isPending}>
                {t('common.save')}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
