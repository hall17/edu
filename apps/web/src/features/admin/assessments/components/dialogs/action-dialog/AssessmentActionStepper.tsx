import { useMutation } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import {
  AssessmentFormData,
  StepperStepId,
  useStepper,
  Stepper,
  questionsAssessmentFormSchema,
  basicAssessmentFormSchema,
} from './AssessmentActionDialog';
import { BasicStep } from './BasicStep';
import { QuestionsStep } from './QuestionsStep';

import { LoadingButton } from '@/components';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useAssessmentsContext } from '@/features/admin/assessments/AssessmentsContext';
import { Assessment, trpc } from '@/lib/trpc';

interface AssessmentActionStepperProps {
  form: UseFormReturn<AssessmentFormData>;
}

export function AssessmentActionStepper({
  form,
}: AssessmentActionStepperProps) {
  const { t } = useTranslation();
  const {
    assessmentsQuery,
    currentRow,
    createAssessment,
    updateAssessment,
    setOpenedDialog,
  } = useAssessmentsContext();
  const methods = useStepper();
  const isEdit = !!currentRow;

  const createMutation = useMutation(trpc.assessment.create.mutationOptions());
  const updateMutation = useMutation(trpc.assessment.update.mutationOptions());

  const [coverImageFile, setCoverImageFile] = useState<File | null | undefined>(
    undefined
  );

  const isLoading = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(data: AssessmentFormData) {
    try {
      if (isEdit && currentRow) {
        const diff = detailedDiff(currentRow, data);

        if (!Object.keys(diff.updated).length) {
          return;
        }

        console.log('diff', diff);

        const updateData = { ...diff.updated } as AssessmentFormData;

        const response = await updateMutation.mutateAsync({
          id: currentRow.id,
          ...updateData,
        });
        toast.success(t('assessments.actionDialog.updateSuccessMessage'));

        if (response && 'signedAwsS3Url' in response) {
          await fetch(response.signedAwsS3Url, {
            method: 'PUT',
            body: coverImageFile,
          });
        }

        assessmentsQuery.refetch();
      } else {
        const response = await createMutation.mutateAsync(data);
        toast.success(t('assessments.actionDialog.createSuccessMessage'));

        if (response && 'signedAwsS3Url' in response) {
          await fetch(response.signedAwsS3Url, {
            method: 'PUT',
            body: coverImageFile,
          });
        }

        assessmentsQuery.refetch();
      }
      form.reset();
      setOpenedDialog(null);
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      if (isEdit) {
        toast.error(t('assessments.actionDialog.updateErrorMessage'));
      } else {
        toast.error(t('assessments.actionDialog.createErrorMessage'));
      }
    }
  }

  async function goToStep(stepId: StepperStepId) {
    const currentStepIndex = methods.all.findIndex(
      (s) => s.id === methods.current.id
    );
    const stepIndex = methods.all.findIndex((s) => s.id === stepId);

    if (currentStepIndex < stepIndex) {
      const schema =
        stepId === 'questions'
          ? questionsAssessmentFormSchema
          : basicAssessmentFormSchema;

      const schemaParsed = await schema.safeParseAsync(form.getValues());

      if (!schemaParsed.success) {
        toast.error(t('common.pleaseEnsureAllFieldsAreValid'));
        schemaParsed.error.issues.forEach((issue) => {
          form.setError(issue.path.join('.') as keyof AssessmentFormData, {
            message: issue.message,
          });
        });
        return false;
      }
    }

    methods.goTo(stepId);
    return true;
  }

  return (
    <Form {...form}>
      <form
        id="assessments-action-form"
        noValidate
        onSubmit={form.handleSubmit(onSubmit, (err) => {
          toast.error(t('common.pleaseEnsureAllFieldsAreValid'));
        })}
        className="flex-1 space-y-6"
      >
        <Stepper.Navigation>
          {methods.all.map((step) => (
            <Stepper.Step
              key={step.id}
              of={step.id}
              type="button"
              onClick={() => {
                goToStep(step.id as StepperStepId);
              }}
            >
              <Stepper.Title>
                {t(`assessments.actionDialog.steps.${step.id}` as any)}
              </Stepper.Title>
            </Stepper.Step>
          ))}
        </Stepper.Navigation>
        {methods.switch({
          basic: () => (
            <BasicStep
              form={form}
              coverImageFile={coverImageFile}
              setCoverImageFile={setCoverImageFile}
            />
          ),
          questions: () => <QuestionsStep form={form} />,
        })}
        <Stepper.Controls>
          {!methods.isFirst && (
            <Button
              type="button"
              variant="secondary"
              onClick={methods.prev}
              disabled={methods.isFirst}
            >
              {t('common.previous')}
            </Button>
          )}
          {!methods.isLast && (
            <Button
              type="button"
              onClick={async () => {
                if (methods.isLast) {
                  const valid = await form.trigger();
                  if (!valid) {
                    toast.error(t('common.pleaseEnsureAllFieldsAreValid'));
                    return false;
                  }
                }
                const currentStepIndex = methods.all.findIndex(
                  (s) => s.id === methods.current.id
                );
                const nextStep = methods.all[currentStepIndex + 1];
                if (!nextStep) {
                  return false;
                }
                goToStep(nextStep.id as StepperStepId);
                return true;
              }}
            >
              {t('common.next')}
            </Button>
          )}
          {(isEdit || methods.isLast) && (
            <LoadingButton
              isLoading={isLoading}
              type="submit"
              form="assessments-action-form"
            >
              {isEdit ? t('common.saveChanges') : t('common.create')}
            </LoadingButton>
          )}
        </Stepper.Controls>
      </form>
    </Form>
  );
}
