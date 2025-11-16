import {
  ClassroomTemplateCreateDto,
  classroomTemplateCreateSchema,
  MODULE_CODES,
  ModuleCode,
} from '@edusama/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { TFunction } from 'i18next';
import { HomeIcon, SettingsIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useClassroomTemplatesContext } from '../ClassroomTemplatesContext';

import { LoadingButton, UnsavedChangesDialog } from '@/components';
import { DatePicker } from '@/components/DatePicker';
import { DroppableImage } from '@/components/DroppableImage';
import { ModuleCard } from '@/components/ModuleCard';
import { Badge } from '@/components/ui/badge';
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import i18n from '@/lib/i18n';
import { trpc } from '@/lib/trpc';

const selectableModules: ModuleCode[] = [
  MODULE_CODES.certificates,
  MODULE_CODES.assessment,
  MODULE_CODES.assignments,
  MODULE_CODES.recordedLiveClasses,
  MODULE_CODES.attendance,
  MODULE_CODES.materials,
];

const formSchema = classroomTemplateCreateSchema.refine(
  (data) => data.endDate > data.startDate,
  {
    message: i18n.t('common.endDateMustBeAfterStartDate'),
    path: ['endDate'],
  }
);

export function ClassroomTemplatesActionDialog() {
  const { t } = useTranslation();
  const { setOpenedDialog, templatesQuery, currentRow } =
    useClassroomTemplatesContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const isEdit = Boolean(currentRow);

  const modulesQuery = useQuery(
    trpc.module.findAll.queryOptions({
      codes: selectableModules,
      branchModules: true,
    })
  );

  const createMutation = useMutation(
    trpc.classroomTemplate.create.mutationOptions()
  );
  const updateMutation = useMutation(
    trpc.classroomTemplate.update.mutationOptions()
  );

  const form = useForm<ClassroomTemplateCreateDto>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        name: currentRow.name || '',
        description: currentRow.description || '',
        capacity: currentRow.capacity,
        attendancePassPercentage: currentRow.attendancePassPercentage,
        assessmentScorePass: currentRow.assessmentScorePass,
        assignmentScorePass: currentRow.assignmentScorePass,
        startDate: currentRow.startDate || new Date(),
        endDate: currentRow.endDate,
        imageUrl: currentRow.imageUrl,
        moduleIds: currentRow.modules.map((module) => module.module.id) || [],
        sendNotifications: currentRow.sendNotifications,
        attendanceThreshold: currentRow.attendanceThreshold,
        reminderFrequency: currentRow.reminderFrequency,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        capacity: 30,
        attendancePassPercentage: 80,
        assessmentScorePass: 80,
        assignmentScorePass: 80,
        startDate: new Date(),
        endDate: (() => {
          const date = new Date();
          date.setMonth(date.getMonth() + 6);
          return date;
        })(),
      });
    }
  }, [isEdit, currentRow]);

  const onSubmit = (data: ClassroomTemplateCreateDto) => {
    if (!isEdit) {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success(t('classrooms.templateDialog.createSuccess'));
          handleFormSuccess();
        },
        onError: (error) => {
          toast.error(t('classrooms.templateDialog.createError'));
          console.error('Create template error:', error);
        },
      });
    } else if (isEdit && currentRow) {
      updateMutation.mutate(
        {
          id: currentRow.id,
          ...data,
        },
        {
          onSuccess: () => {
            toast.success(t('classrooms.templateDialog.updateSuccess'));
            handleFormSuccess();
          },
          onError: (error) => {
            toast.error(t('classrooms.templateDialog.updateError'));
            console.error('Update template error:', error);
          },
        }
      );
    }
  };

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
    templatesQuery.refetch();
    setOpenedDialog(null);
  }

  function handleFormCancel() {
    setOpenedDialog(null);
  }

  return (
    <>
      <Dialog open onOpenChange={handleDialogClose}>
        <DialogContent className="xs:max-w-[80%] max-h-[90%] sm:max-w-[70%]">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? t('classrooms.templates.editTitle')
                : t('classrooms.templates.createTitle')}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? t('classrooms.templates.editDescription')
                : t('classrooms.templates.createDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col">
            <Form {...form}>
              <form
                id="classrooms-template-form"
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex-1 space-y-6"
                tabIndex={0}
              >
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="space-y-4"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="basic"
                      className="flex items-center gap-2"
                    >
                      <HomeIcon className="h-4 w-4" />
                      <span className="xs:block hidden">
                        {t('classrooms.templateDialog.steps.basic')}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="modules"
                      className="flex items-center gap-2"
                    >
                      <SettingsIcon className="h-4 w-4" />
                      <span className="xs:block hidden">
                        {t('classrooms.templateDialog.steps.modules')}
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <DroppableImage
                          size="sm"
                          value={field.value ?? undefined}
                          onChange={field.onChange}
                          uploadText={t(
                            'classrooms.templateDialog.fields.uploadImage'
                          )}
                          changeText={t(
                            'classrooms.templateDialog.fields.changeImage'
                          )}
                          helpText={t(
                            'classrooms.templateDialog.fields.imageUploadHelp'
                          )}
                          previewTitle={t(
                            'classrooms.templateDialog.fields.templateImage'
                          )}
                          previewSubtitle={t(
                            'classrooms.templateDialog.fields.imagePreview'
                          )}
                        />
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('classrooms.templateDialog.fields.name')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t(
                                'classrooms.templateDialog.fields.namePlaceholder'
                              )}
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
                            {t('classrooms.templateDialog.fields.description')}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder={t(
                                'classrooms.templateDialog.fields.descriptionPlaceholder'
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('classrooms.templateDialog.fields.capacity')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              placeholder={t(
                                'classrooms.templateDialog.fields.capacityPlaceholder'
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="items-start gap-4 space-y-6 md:grid md:grid-cols-2 md:space-y-0">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t('classrooms.templateDialog.fields.startDate')}
                            </FormLabel>
                            <FormControl>
                              <DatePicker
                                selected={field.value ?? undefined}
                                onSelect={field.onChange}
                                placeholder={t(
                                  'classrooms.templateDialog.fields.startDatePlaceholder'
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t('classrooms.templateDialog.fields.endDate')}
                            </FormLabel>
                            <FormControl>
                              <DatePicker
                                selected={field.value ?? undefined}
                                onSelect={field.onChange}
                                placeholder={t(
                                  'classrooms.templateDialog.fields.endDatePlaceholder'
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 items-start gap-x-2 gap-y-4 lg:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="attendancePassPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t(
                                'classrooms.templateDialog.fields.attendancePass'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                                min={0}
                                max={100}
                                placeholder={t(
                                  'classrooms.templateDialog.fields.attendancePassPlaceholder'
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assessmentScorePass"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t(
                                'classrooms.templateDialog.fields.assessmentPass'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                                min={0}
                                max={100}
                                placeholder={t(
                                  'classrooms.templateDialog.fields.assessmentPassPlaceholder'
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assignmentScorePass"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t(
                                'classrooms.templateDialog.fields.assignmentPass'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                                min={0}
                                max={100}
                                placeholder={t(
                                  'classrooms.templateDialog.fields.assignmentPassPlaceholder'
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sendNotifications"
                        render={({ field }) => (
                          <FormItem className="flex self-center">
                            <FormLabel>
                              {t(
                                'classrooms.templateDialog.fields.sendNotifications'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="attendanceThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t(
                                'classrooms.templateDialog.fields.attendanceThreshold'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                value={field.value ?? undefined}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                                placeholder={t(
                                  'classrooms.templateDialog.fields.attendanceThresholdPlaceholder'
                                )}
                                disabled={!form.watch('sendNotifications')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reminderFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t(
                                'classrooms.templateDialog.fields.reminderFrequency'
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                value={field.value ?? undefined}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                                placeholder={t(
                                  'classrooms.templateDialog.fields.reminderFrequencyPlaceholder'
                                )}
                                disabled={!form.watch('sendNotifications')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="modules" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="moduleIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            {t('classrooms.templateDialog.fields.modules')}
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              {modulesQuery.data?.modules?.map(
                                (module: any) => {
                                  const isAvailable =
                                    'branches' in module &&
                                    module.branches.length > 0 &&
                                    module.branches.some(
                                      (branch: any) =>
                                        branch.status === 'ACTIVE'
                                    );
                                  const isSelected =
                                    field.value?.includes(module.id) || false;

                                  return (
                                    <ModuleCard
                                      key={module.id}
                                      module={module}
                                      isSelected={isSelected}
                                      isAvailable={isAvailable}
                                      onToggle={(checked) => {
                                        if (checked) {
                                          field.onChange([
                                            ...(field.value || []),
                                            module.id,
                                          ]);
                                        } else {
                                          field.onChange(
                                            field.value?.filter(
                                              (id: number) => id !== module.id
                                            ) || []
                                          );
                                        }
                                      }}
                                      t={t}
                                    />
                                  );
                                }
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </form>
            </Form>

            <div className="flex justify-end gap-2 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleFormCancel}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
              <LoadingButton
                type="submit"
                form="classrooms-template-form"
                isLoading={isLoading}
              >
                {!isEdit ? t('common.create') : t('common.saveChanges')}
              </LoadingButton>
            </div>
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
