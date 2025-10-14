import { BranchStatus } from '@edusama/server';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useBranchesContext } from '../../BranchesContext';

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

const branchFormSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
  location: z.string().optional(),
  contact: z.string().optional(),
  status: z.nativeEnum(BranchStatus),
  companyId: z.number().int(),
});

type BranchFormData = z.infer<typeof branchFormSchema>;

export function BranchesActionDialog() {
  const { t } = useTranslation();
  const { openedDialog, setOpenedDialog, currentRow, companies } =
    useBranchesContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isOpen = openedDialog === 'add' || openedDialog === 'edit';
  const isEdit = openedDialog === 'edit';

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      location: '',
      contact: '',
      status: BranchStatus.ACTIVE,
      companyId: 0,
    },
  });

  const { reset, handleSubmit, formState } = form;

  useEffect(() => {
    if (isEdit && currentRow) {
      reset({
        name: currentRow.name,
        slug: currentRow.slug,
        location: currentRow.location || '',
        contact: currentRow.contact || '',
        status: currentRow.status,
        companyId: currentRow.companyId,
      });
    } else {
      reset({
        name: '',
        slug: '',
        location: '',
        contact: '',
        status: BranchStatus.ACTIVE,
        companyId: 0,
      });
    }
  }, [isEdit, currentRow, reset]);

  const createMutation = useMutation(
    trpc.branch.create.mutationOptions({
      onSuccess: (branch) => {
        toast.success(
          t('companiesAndBranches.branches.actionDialog.createSuccess')
        );
        handleFormSuccess();
      },
      onError: () => {
        toast.error(
          t('companiesAndBranches.branches.actionDialog.createError')
        );
      },
    })
  );

  const updateMutation = useMutation(
    trpc.branch.update.mutationOptions({
      onSuccess: (branch) => {
        toast.success(
          t('companiesAndBranches.branches.actionDialog.updateSuccess')
        );
        handleFormSuccess();
      },
      onError: () => {
        toast.error(
          t('companiesAndBranches.branches.actionDialog.updateError')
        );
      },
    })
  );

  function onSubmit(data: BranchFormData) {
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
                ? t('companiesAndBranches.branches.actionDialog.editTitle')
                : t('companiesAndBranches.branches.actionDialog.addTitle')}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? t(
                    'companiesAndBranches.branches.actionDialog.editDescription'
                  )
                : t(
                    'companiesAndBranches.branches.actionDialog.addDescription'
                  )}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        'companiesAndBranches.branches.actionDialog.form.company'
                      )}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t(
                              'companiesAndBranches.branches.actionDialog.form.selectCompany'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">
                          {t(
                            'companiesAndBranches.branches.actionDialog.form.selectCompany'
                          )}
                        </SelectItem>
                        {companies.map((company) => (
                          <SelectItem
                            key={company.id}
                            value={company.id.toString()}
                          >
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        'companiesAndBranches.branches.actionDialog.form.name'
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
                        'companiesAndBranches.branches.actionDialog.form.slug'
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        'companiesAndBranches.branches.actionDialog.form.location'
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
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        'companiesAndBranches.branches.actionDialog.form.contact'
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
                        'companiesAndBranches.branches.actionDialog.form.status'
                      )}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t(
                              'companiesAndBranches.branches.actionDialog.form.selectStatus'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(BranchStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {t(`branchStatuses.${status}`)}
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
