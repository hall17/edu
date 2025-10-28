import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useMaterialsContext } from '../MaterialsContext';

import { UnsavedChangesDialog } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Subject, trpc } from '@/lib/trpc';

const editSubjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

type EditSubjectFormData = z.infer<typeof editSubjectSchema>;

export function MaterialsManageSubjectsDialog() {
  const { t } = useTranslation();
  const { open, setOpen, subjectsQuery, updateSubject, deleteSubject } =
    useMaterialsContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const isOpen = open === 'manage-subjects';

  const form = useForm<EditSubjectFormData>({
    resolver: zodResolver(editSubjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const updateSubjectMutation = useMutation(
    trpc.subject.update.mutationOptions({
      onSuccess: (data) => {
        updateSubject(data);
        toast.success(t('materials.manageSubjects.updateSuccess'));
        setEditingId(null);
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message || t('materials.manageSubjects.updateError'));
      },
    })
  );

  const deleteSubjectMutation = useMutation(
    trpc.subject.delete.mutationOptions({
      onSuccess: (data, variables) => {
        deleteSubject(variables.id);
        toast.success(t('materials.manageSubjects.deleteSuccess'));
      },
      onError: (error) => {
        toast.error(error.message || t('materials.manageSubjects.deleteError'));
      },
    })
  );

  function handleClose() {
    setOpen(null);
    setEditingId(null);
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

    if (!state && (isDirty || editingId)) {
      setShowConfirmDialog(true);
    } else {
      setOpen(null);
      setEditingId(null);
      form.reset();
    }
  }

  function handleConfirmClose() {
    setShowConfirmDialog(false);
    setOpen(null);
    setEditingId(null);
    form.reset();
  }

  function handleCancelClose() {
    setShowConfirmDialog(false);
  }

  function startEdit(subject: Subject) {
    setEditingId(subject.id);
    form.setValue('name', subject.name);
    form.setValue('description', subject.description || '');
  }

  function cancelEdit() {
    setEditingId(null);
    form.reset();
  }

  function onSubmit(data: EditSubjectFormData) {
    if (!editingId) return;

    updateSubjectMutation.mutate({
      id: editingId,
      name: data.name,
      description: data.description || '',
    });
  }

  function handleDelete(id: string) {
    if (window.confirm(t('materials.manageSubjects.deleteConfirm'))) {
      deleteSubjectMutation.mutate({ id });
    }
  }

  const subjects = subjectsQuery.data?.subjects || [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('materials.manageSubjects.title')}</DialogTitle>
            <DialogDescription>
              {t('materials.manageSubjects.description')}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {subjects.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  {t('materials.manageSubjects.noSubjects')}
                </div>
              ) : (
                subjects.map((subject) => (
                  <div key={subject.id} className="rounded-lg border p-4">
                    {editingId === subject.id ? (
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-3"
                        >
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder={t(
                                      'materials.manageSubjects.placeholders.name'
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
                                <FormControl>
                                  <Textarea
                                    placeholder={t(
                                      'materials.manageSubjects.placeholders.description'
                                    )}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              size="sm"
                              disabled={updateSubjectMutation.isPending}
                            >
                              <Check className="mr-1 size-4" />
                              {t('materials.manageSubjects.save')}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={cancelEdit}
                              disabled={updateSubjectMutation.isPending}
                            >
                              <X className="mr-1 size-4" />
                              {t('common.cancel')}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{subject.name}</h4>
                          {subject.description && (
                            <p className="text-muted-foreground mt-1 text-sm">
                              {subject.description}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 flex gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEdit(subject)}
                              >
                                <Pencil className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {t('materials.manageSubjects.edit')}
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(subject.id)}
                                className="hover:text-red-500"
                                disabled={deleteSubjectMutation.isPending}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {t('materials.manageSubjects.delete')}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleClose}>
              {t('common.close')}
            </Button>
          </div>
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
