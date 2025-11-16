import { CompanyStatus } from '@edusama/common';
import { companyCreateSchema, CompanyCreateDto } from '@edusama/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useCompaniesContext } from '../../CompaniesContext';

import { LoadingButton, UnsavedChangesDialog } from '@/components';
import { DroppableImage } from '@/components/DroppableImage';
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
import { DEFAULT_IMAGE_SIZE } from '@/utils/constants';

export function CompaniesActionDialog() {
  const { t } = useTranslation();
  const { companiesQuery, openedDialog, setOpenedDialog, currentRow } =
    useCompaniesContext();
  const createMutation = useMutation(trpc.company.create.mutationOptions());
  const updateMutation = useMutation(trpc.company.update.mutationOptions());

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null | undefined>(undefined);

  const isOpen = openedDialog === 'add' || openedDialog === 'edit';
  const isEdit = openedDialog === 'edit';

  const form = useForm<CompanyCreateDto>({
    resolver: zodResolver(companyCreateSchema),
  });

  function getDefaultValues(): CompanyCreateDto {
    if (isEdit && currentRow) {
      return {
        name: currentRow.name,
        slug: currentRow.slug,
        status: currentRow.status,
        logoUrl: currentRow.logoUrl || '',
        websiteUrl: currentRow.websiteUrl || '',
        maximumBranches: currentRow.maximumBranches,
      };
    }

    return {
      name: '',
      slug: '',
      status: CompanyStatus.ACTIVE,
      logoUrl: '',
      websiteUrl: '',
      maximumBranches: 10,
    };
  }

  useEffect(() => {
    form.reset(getDefaultValues());
  }, [isEdit, currentRow, form]);

  async function onSubmit(data: CompanyCreateDto) {
    try {
      if (isEdit && currentRow) {
        const diff = detailedDiff(getDefaultValues(), data);

        if (!Object.keys(diff.updated).length) {
          return;
        }

        const updateData = { ...diff.updated } as CompanyCreateDto;

        const response = await updateMutation.mutateAsync({
          ...updateData,
          id: currentRow.id,
        });

        if (response && 'signedAwsS3Url' in response) {
          await fetch(response.signedAwsS3Url, {
            method: 'PUT',
            body: logoFile,
          });
        }

        await companiesQuery.refetch();

        toast.success(
          t('companiesAndBranches.companies.actionDialog.updateSuccess')
        );
        handleFormSuccess();
      } else {
        const response = await createMutation.mutateAsync(data);
        if (response && 'signedAwsS3Url' in response) {
          await fetch(response.signedAwsS3Url, {
            method: 'PUT',
            body: logoFile,
          });
        }

        await companiesQuery.refetch();

        toast.success(
          t('companiesAndBranches.companies.actionDialog.createSuccess')
        );
        handleFormSuccess();
      }
    } catch (error) {
      if (isEdit) {
        toast.error(
          t('companiesAndBranches.companies.actionDialog.updateError')
        );
      } else {
        toast.error(
          t('companiesAndBranches.companies.actionDialog.createError')
        );
      }
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
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              tabIndex={0}
            >
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem
                    className="md:col-span-2 lg:col-span-1"
                    autoFocus={false}
                  >
                    <FormLabel className="justify-center">
                      {t('common.logoUrl')}
                    </FormLabel>
                    <FormControl>
                      <DroppableImage
                        size="2xl"
                        value={
                          logoFile === null
                            ? undefined
                            : (field.value ?? undefined)
                        }
                        onChange={(file) => {
                          field.onChange(
                            file ? file.name : file === null ? null : undefined
                          );
                          setLogoFile(file);
                        }}
                        uploadText={t('common.uploadLogo')}
                        changeText={t('common.changeLogo')}
                        helpText={t('common.logoUploadHelp')}
                        previewTitle={t('common.logoUrl')}
                        previewSubtitle={t('common.logoPreview')}
                        maxSize={DEFAULT_IMAGE_SIZE}
                        accept={{
                          'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
                        }}
                      />
                    </FormControl>
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
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        'companiesAndBranches.companies.actionDialog.form.websiteUrl'
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
                name="maximumBranches"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        'companiesAndBranches.companies.actionDialog.form.maximumBranches'
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
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
                        <SelectTrigger className="w-full">
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
