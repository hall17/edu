import { BranchStatus, MAX_STUDENTS_PER_BRANCH } from '@edusama/common';
import { branchCreateSchema, BranchCreateDto } from '@edusama/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
import { trpc, Branch } from '@/lib/trpc';
import { DEFAULT_IMAGE_SIZE } from '@/utils/constants';

interface BranchFormDialogProps {
  mode: 'add' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: BranchCreateDto,
    logoFile: File | null | undefined
  ) => Promise<void>;
  currentRow?: Branch;
  selectedCompanyId?: number | null;
  showExtraFields?: boolean;
  isLoading?: boolean;
}

export function BranchFormDialog({
  mode,
  isOpen,
  onClose,
  onSubmit,
  currentRow,
  selectedCompanyId,
  showExtraFields = false,
  isLoading,
}: BranchFormDialogProps) {
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null | undefined>(undefined);

  const allCompaniesQuery = useQuery(
    trpc.company.findAll.queryOptions({ all: true })
  );
  const companies = allCompaniesQuery.data?.companies ?? [];

  const isEdit = mode === 'edit';

  const form = useForm<BranchCreateDto>({
    resolver: zodResolver(branchCreateSchema),
  });

  const { reset, handleSubmit } = form;

  function getDefaultValues(): BranchCreateDto {
    if (isEdit && currentRow) {
      return {
        name: currentRow.name,
        slug: currentRow.slug,
        location: currentRow.location || '',
        contact: currentRow.contact || '',
        status: currentRow.status,
        companyId: currentRow.companyId,
        logoUrl: currentRow.logoUrl || '',
        canBeDeleted: currentRow.canBeDeleted,
        maximumStudents: currentRow.maximumStudents,
      };
    }

    return {
      name: '',
      slug: '',
      location: '',
      contact: '',
      logoUrl: '',
      status: BranchStatus.ACTIVE,
      companyId: selectedCompanyId || 0,
      canBeDeleted: true,
      maximumStudents: showExtraFields ? 250 : 100,
    };
  }

  useEffect(() => {
    reset(getDefaultValues());
  }, [isEdit, currentRow, selectedCompanyId, showExtraFields, reset]);

  async function handleSubmitForm(data: BranchCreateDto) {
    if (isEdit) {
      const diff = detailedDiff(getDefaultValues(), data);
      if (!Object.keys(diff.updated).length) {
        return;
      }

      const updateData = { ...diff.updated } as BranchCreateDto;

      await onSubmit(updateData, logoFile);
    } else {
      await onSubmit(data, logoFile);
    }
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
      handleConfirmClose();
    }
  }

  function handleConfirmClose() {
    setShowConfirmDialog(false);
    onClose();
    form.reset();
  }

  function handleCancelClose() {
    setShowConfirmDialog(false);
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
            <form
              id="branch-form"
              onSubmit={handleSubmit(handleSubmitForm)}
              className="space-y-4"
              tabIndex={0}
            >
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 lg:col-span-1">
                    <FormLabel className="justify-center">
                      {t('common.logoUrl')}
                    </FormLabel>
                    <FormControl>
                      <DroppableImage
                        size="md"
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      {t(
                        'companiesAndBranches.branches.actionDialog.form.status'
                      )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      {t(
                        'companiesAndBranches.branches.actionDialog.form.company'
                      )}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
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
                    <FormLabel required>
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
                    <FormLabel required>
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
              {showExtraFields && (
                <>
                  <FormField
                    control={form.control}
                    name="maximumStudents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t(
                            'companiesAndBranches.branches.actionDialog.form.maximumStudents'
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            min={1}
                            max={MAX_STUDENTS_PER_BRANCH}
                            onChange={(e) => {
                              const value = Math.min(
                                Math.max(parseInt(e.target.value) || 0, 1),
                                MAX_STUDENTS_PER_BRANCH
                              );
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleConfirmClose}
                >
                  {t('common.cancel')}
                </Button>
                <LoadingButton
                  type="submit"
                  form="branch-form"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
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
