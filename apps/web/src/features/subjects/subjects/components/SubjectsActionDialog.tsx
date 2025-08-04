import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { detailedDiff } from 'deep-object-diff';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useSubjectsContext } from '../SubjectsContext';

import { LoadingButton, UnsavedChangesDialog } from '@/components';
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
import { Subject, trpc } from '@/lib/trpc';

const addSubjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

type AddSubjectFormData = z.infer<typeof addSubjectSchema>;

export function SubjectsActionDialog() {
  const { t } = useTranslation();
  const { createSubject, updateSubject, setOpenedDialog, currentRow } =
    useSubjectsContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isEdit = !!currentRow;

  const defaultValues: AddSubjectFormData = isEdit
    ? {
        name: currentRow?.name || '',
        description: currentRow?.description || '',
      }
    : {
        name: '',
        description: '',
      };

  const form = useForm<AddSubjectFormData>({
    resolver: zodResolver(addSubjectSchema),
    defaultValues,
  });

  const createSubjectMutation = useMutation(
    trpc.subject.create.mutationOptions({
      onSuccess: (data) => {
        createSubject(data);
        toast.success(t('materials.addSubject.createSuccess'));
        setOpenedDialog(null);
      },
    })
  );

  const updateSubjectMutation = useMutation(
    trpc.subject.update.mutationOptions({
      onSuccess: (data) => {
        updateSubject(data);
        toast.success(t('materials.manageSubjects.updateSuccess'));
        setOpenedDialog(null);
      },
    })
  );

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
      setShowConfirmDialog(true);
    } else {
      form.reset();
      setOpenedDialog(null);
    }
  }

  function handleConfirmClose() {
    setShowConfirmDialog(false);
    form.reset();
    setOpenedDialog(null);
  }

  function handleCancelClose() {
    setShowConfirmDialog(false);
  }

  function onSubmit(data: AddSubjectFormData) {
    if (isEdit && currentRow) {
      updateSubjectMutation.mutate({
        id: currentRow.id,
        name: data.name,
        description: data.description || '',
      });
    } else {
      createSubjectMutation.mutate({
        name: data.name,
        description: data.description || '',
      });
    }
  }

  return (
    <>
      <Dialog open onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? t('materials.manageSubjects.title')
                : t('materials.addSubject.title')}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? t('materials.manageSubjects.description')
                : t('materials.addSubject.description')}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      {t('materials.addSubject.fields.name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'materials.addSubject.placeholders.name'
                        )}
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
                    <FormLabel>
                      {t('materials.addSubject.fields.description')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          'materials.addSubject.placeholders.description'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Display Curriculums (Edit Mode Only) */}
              {isEdit &&
                currentRow?.curriculums &&
                currentRow.curriculums.length > 0 && (
                  <>
                    <div className="mt-6 border-t pt-4">
                      <h4 className="mb-3 text-sm font-medium">
                        {t('subjects.viewDialog.curriculums')}
                      </h4>
                      <div className="max-h-48 space-y-2 overflow-y-auto">
                        {currentRow.curriculums.map((curriculum) => (
                          <div
                            key={curriculum.id}
                            className="bg-muted/30 flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {curriculum.name}
                              </p>
                              {curriculum.description && (
                                <p className="text-muted-foreground mt-1 text-xs">
                                  {curriculum.description}
                                </p>
                              )}
                              <div className="mt-1 flex items-center gap-4">
                                <span className="text-muted-foreground text-xs">
                                  {t('common.createdAt')}:{' '}
                                  {dayjs(curriculum.createdAt).format(
                                    'DD/MM/YYYY'
                                  )}
                                </span>
                                {curriculum.lessons &&
                                  curriculum.lessons.length > 0 && (
                                    <span className="text-muted-foreground text-xs">
                                      {curriculum.lessons.length}{' '}
                                      {t('subjects.viewDialog.lessons')}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenedDialog(null)}
                  disabled={
                    createSubjectMutation.isPending ||
                    updateSubjectMutation.isPending
                  }
                >
                  {t('common.cancel')}
                </Button>
                <LoadingButton
                  type="submit"
                  isLoading={
                    createSubjectMutation.isPending ||
                    updateSubjectMutation.isPending
                  }
                >
                  {isEdit ? t('common.saveChanges') : t('common.create')}
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
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
