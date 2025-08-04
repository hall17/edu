import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useMaterialsContext } from '../MaterialsContext';

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
import { trpc } from '@/lib/trpc';

const addSubjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

type AddSubjectFormData = z.infer<typeof addSubjectSchema>;

export function MaterialsAddSubjectDialog() {
  const { t } = useTranslation();
  const { open, setOpen, createSubject } = useMaterialsContext();
  const isOpen = open === 'add-subject';
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const form = useForm<AddSubjectFormData>({
    resolver: zodResolver(addSubjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const createSubjectMutation = useMutation(
    trpc.subject.create.mutationOptions({
      onSuccess: (data) => {
        createSubject(data);
        toast.success(t('materials.addSubject.createSuccess'));
        handleClose();
      },
    })
  );

  function handleClose() {
    setOpen(null);
    form.reset();
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
      setShowConfirmDialog(true);
    } else {
      form.reset();
      setOpen(null);
    }
  }

  function handleConfirmClose() {
    setShowConfirmDialog(false);
    form.reset();
    setOpen(null);
  }

  function handleCancelClose() {
    setShowConfirmDialog(false);
  }

  function onSubmit(data: AddSubjectFormData) {
    createSubjectMutation.mutate({
      name: data.name,
      description: data.description || '',
    });
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('materials.addSubject.title')}</DialogTitle>
            <DialogDescription>
              {t('materials.addSubject.description')}
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

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={createSubjectMutation.isPending}
                >
                  {t('common.cancel')}
                </Button>
                <LoadingButton
                  type="submit"
                  isLoading={createSubjectMutation.isPending}
                >
                  {t('common.create')}
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
