import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useAssessmentsContext } from '../AssessmentsContext';

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
import { trpc } from '@/lib/trpc';

const assignmentFormSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

type AssignmentFormData = z.infer<typeof assignmentFormSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroomIntegrationId: string;
  classroomName: string;
}

export function AssessmentClassroomAssignmentFormDialog({
  open,
  onOpenChange,
  classroomIntegrationId,
  classroomName,
}: Props) {
  const { t } = useTranslation();
  const { currentRow, assessmentsQuery } = useAssessmentsContext();

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
    },
  });

  const createMutation = useMutation(
    trpc.assessment.createClassroomIntegrationAssessment.mutationOptions({
      onSuccess: () => {
        toast.success(t('assessments.classroomAssignment.success'));
        assessmentsQuery.refetch();
        onOpenChange(false);
        form.reset();
      },
      onError: (error) => {
        toast.error(
          error.message || t('assessments.classroomAssignment.error')
        );
      },
    })
  );

  function onSubmit(data: AssignmentFormData) {
    if (!currentRow?.id) return;

    createMutation.mutate({
      assessmentId: currentRow.id,
      classroomIntegrationId,
      startDate: data.startDate,
      endDate: data.endDate,
    });
  }

  function handleOpenChange(open: boolean) {
    if (!open && !createMutation.isPending) {
      form.reset();
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t('assessments.assignmentForm.title')}</DialogTitle>
          <DialogDescription>
            {t('assessments.assignmentForm.description', {
              classroom: classroomName,
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
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => field.onChange(date?.toISOString())}
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
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => field.onChange(date?.toISOString())}
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
                onClick={() => handleOpenChange(false)}
                disabled={createMutation.isPending}
              >
                {t('common.cancel')}
              </Button>
              <LoadingButton
                type="submit"
                isLoading={createMutation.isPending}
                disabled={createMutation.isPending}
              >
                {t('assessments.assignmentForm.assign')}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
