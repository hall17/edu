import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useUnitLessonsContext } from '../UnitLessonsContext';

import { LoadingButton } from '@/components';
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
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';

function getFormSchema(t: TFunction) {
  return z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(1000).optional(),
  });
}

type LessonForm = z.infer<ReturnType<typeof getFormSchema>>;

export function LessonsActionDialog() {
  const { t } = useTranslation();
  const {
    unit,
    currentRow,
    setOpenedDialog,
    openedDialog,
    createLesson,
    updateLesson,
    lessons,
  } = useUnitLessonsContext();

  const createLessonMutation = useMutation(
    trpc.lesson.create.mutationOptions()
  );
  const updateLessonMutation = useMutation(
    trpc.lesson.update.mutationOptions()
  );

  const isEditMode = openedDialog === 'edit';

  const defaultValues = useMemo(() => {
    if (isEditMode && currentRow) {
      return {
        name: currentRow.name,
        description: currentRow.description ?? '',
      };
    }
    return {
      name: '',
      description: '',
    };
  }, [isEditMode, currentRow]);

  const form = useForm<LessonForm>({
    resolver: zodResolver(getFormSchema(t)),
    defaultValues,
  });

  async function onSubmit(data: LessonForm) {
    try {
      if (isEditMode) {
        const updatedLesson = await updateLessonMutation.mutateAsync({
          id: currentRow.id,
          ...data,
        });

        updateLesson(updatedLesson);
        toast.success(t('subjects.curriculums.lessons.updateSuccess'));
      } else {
        const newLesson = await createLessonMutation.mutateAsync({
          unitId: unit?.id ?? '',
          order: lessons.length,
          ...data,
        });

        createLesson(newLesson);
        toast.success(t('subjects.curriculums.lessons.createSuccess'));
      }

      setOpenedDialog(null);
      form.reset();
    } catch (error) {
      // Error handled by mutation
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setOpenedDialog(null);
      form.reset();
    }
  }

  return (
    <Dialog open={!!openedDialog} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the lesson information.'
              : 'Create a new lesson for this unit.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter lesson name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter lesson description..."
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                {t('common.cancel')}
              </Button>
              <LoadingButton
                type="submit"
                isLoading={
                  createLessonMutation.isPending ||
                  updateLessonMutation.isPending
                }
              >
                {isEditMode ? t('common.update') : t('common.create')}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
