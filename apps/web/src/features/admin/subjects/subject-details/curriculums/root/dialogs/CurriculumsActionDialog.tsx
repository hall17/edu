import {
  CurriculumStatus,
  curriculumCreateSchema,
  curriculumUpdateSchema,
} from '@edusama/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useCurriculumsContext } from '../CurriculumsContext';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSubjectDetailsContext } from '@/features/admin/subjects/subject-details/SubjectDetailsContext';
import { trpc } from '@/lib/trpc';

export function CurriculumsActionDialog() {
  const { t } = useTranslation();
  const {
    currentRow,
    setOpenedDialog,
    openedDialog,
    createCurriculum,
    updateCurriculum,
    curriculums,
  } = useCurriculumsContext();
  const { subjectId } = useSubjectDetailsContext();

  const createCurriculumMutation = useMutation(
    trpc.curriculum.create.mutationOptions()
  );
  const updateCurriculumMutation = useMutation(
    trpc.curriculum.update.mutationOptions()
  );
  const isLoading =
    createCurriculumMutation.isPending || updateCurriculumMutation.isPending;
  const isEditMode = openedDialog === 'edit';

  const defaultValues = useMemo(() => {
    if (isEditMode && currentRow) {
      return {
        id: currentRow.id,
        subjectId: currentRow.subjectId,
        name: currentRow.name,
        description: currentRow.description ?? '',
        status: currentRow.status,
      };
    }
    return {
      name: '',
      description: '',
      status: CurriculumStatus.ACTIVE,
      subjectId: subjectId ?? '',
    };
  }, [isEditMode, currentRow]);

  const schema = isEditMode ? curriculumUpdateSchema : curriculumCreateSchema;
  type CurriculumForm = z.infer<typeof schema>;

  const form = useForm<CurriculumForm>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  async function onSubmit(data: CurriculumForm) {
    try {
      if ('id' in data) {
        const updatedCurriculum =
          await updateCurriculumMutation.mutateAsync(data);

        updateCurriculum(updatedCurriculum as any);
        toast.success(t('subjects.curriculums.updateSuccess'));
      } else {
        const newCurriculum = await createCurriculumMutation.mutateAsync(data);

        createCurriculum(newCurriculum as any);
        toast.success(t('subjects.curriculums.createSuccess'));
      }

      setOpenedDialog(null);
      form.reset();
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? t('subjects.curriculums.editTitle')
              : t('subjects.curriculums.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t('subjects.curriculums.editDescription')
              : t('subjects.curriculums.createDescription')}
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
                    <Input
                      placeholder={t('subjects.curriculums.namePlaceholder')}
                      {...field}
                    />
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
                      placeholder={t(
                        'subjects.curriculums.descriptionPlaceholder'
                      )}
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.status')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('subjects.curriculums.selectStatus')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CurriculumStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`curriculumStatuses.${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenedDialog(null)}
              >
                {t('common.cancel')}
              </Button>
              <LoadingButton type="submit" isLoading={isLoading}>
                {isEditMode ? t('common.update') : t('common.create')}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
