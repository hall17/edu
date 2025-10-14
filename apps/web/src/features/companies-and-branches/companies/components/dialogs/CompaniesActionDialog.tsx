import { CompanyStatus } from '@edusama/server';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useCompaniesContext } from '../../CompaniesContext';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trpc } from '@/lib/trpc';

const companyFormSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
  status: z.nativeEnum(CompanyStatus),
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

export function CompaniesActionDialog() {
  const { t } = useTranslation();
  const { openedDialog, setOpenedDialog, currentRow } = useCompaniesContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isOpen = openedDialog === 'add' || openedDialog === 'edit';
  const isEdit = openedDialog === 'edit';

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      status: CompanyStatus.ACTIVE,
    },
  });

  const { reset, handleSubmit, formState } = form;

  useEffect(() => {
    if (isEdit && currentRow) {
      reset({
        name: currentRow.name,
        slug: currentRow.slug,
        status: currentRow.status,
      });
    } else {
      reset({
        name: '',
        slug: '',
        status: CompanyStatus.ACTIVE,
      });
    }
  }, [isEdit, currentRow, reset]);

  const createMutation = useMutation(
    trpc.company.create.mutationOptions({
      onSuccess: (company) => {
        toast.success(
          t('companiesAndBranches.companies.actionDialog.createSuccess')
        );
        handleFormSuccess();
      },
      onError: () => {
        toast.error(
          t('companiesAndBranches.companies.actionDialog.createError')
        );
      },
    })
  );

  const updateMutation = useMutation(
    trpc.company.update.mutationOptions({
      onSuccess: (company) => {
        toast.success(
          t('companiesAndBranches.companies.actionDialog.updateSuccess')
        );
        handleFormSuccess();
      },
      onError: () => {
        toast.error(
          t('companiesAndBranches.companies.actionDialog.updateError')
        );
      },
    })
  );

  function onSubmit(data: CompanyFormData) {
    if (isEdit && currentRow) {
      updateMutation.mutate({ ...data, id: currentRow.id });
    } else {
      createMutation.mutate(data);
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;

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
    setOpenedDialog(null);
    form.reset();
  }

  function handleCancelClose() {
    setShowConfirmDialog(false);
  }

  function handleFormSuccess() {
    setOpenedDialog(null);
    form.reset();
  }

  function handleFormCancel() {
    setOpenedDialog(null);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? t('companiesAndBranches.companies.actionDialog.editTitle')
                : t('companiesAndBranches.companies.actionDialog.addTitle')}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? t(
                    'companiesAndBranches.companies.actionDialog.editDescription'
                  )
                : t(
                    'companiesAndBranches.companies.actionDialog.addDescription'
                  )}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        'companiesAndBranches.companies.actionDialog.form.name'
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        'companiesAndBranches.companies.actionDialog.form.slug'
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>
                      {t(
                        'companiesAndBranches.companies.actionDialog.form.status'
                      )}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              'companiesAndBranches.companies.actionDialog.form.selectStatus'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(CompanyStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {t(`companyStatuses.${status}`)}
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
                  onClick={handleFormCancel}
                  disabled={isLoading}
                >
                  {t('common.cancel')}
                </Button>
                <LoadingButton type="submit" isLoading={isLoading}>
                  {isEdit ? t('common.update') : t('common.create')}
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
