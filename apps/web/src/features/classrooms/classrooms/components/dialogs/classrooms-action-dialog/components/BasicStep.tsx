import { useQuery } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { initialValues } from '../ClassroomsActionDialog';
import { FormData } from '../getFormSchema';

import { DatePicker } from '@/components/DatePicker';
import { DroppableImage } from '@/components/DroppableImage';
import { Combobox } from '@/components/ui/combobox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';

interface BasicStepProps {
  form: UseFormReturn<FormData>;
}

export function BasicStep({ form }: BasicStepProps) {
  const { t } = useTranslation();

  const templatesQuery = useQuery(
    trpc.classroomTemplate.findAll.queryOptions({ all: true })
  );

  function handleSelectedClassroomTemplateChange(templateId: string) {
    if (!templateId) {
      form.reset(initialValues);
      return;
    }

    form.setValue('classroomTemplateId', templateId);

    const selectedTemplate = templatesQuery.data?.classroomTemplates?.find(
      (template) => template.id === templateId
    );

    if (selectedTemplate) {
      form.setValue('name', selectedTemplate.name);
      form.setValue('description', selectedTemplate.description || '');
      form.setValue('capacity', selectedTemplate.capacity);
      form.setValue(
        'attendancePassPercentage',
        selectedTemplate.attendancePassPercentage
      );
      form.setValue(
        'assessmentScorePass',
        selectedTemplate.assessmentScorePass
      );
      form.setValue(
        'assignmentScorePass',
        selectedTemplate.assignmentScorePass
      );
      form.setValue(
        'startDate',
        selectedTemplate.startDate
          ? new Date(selectedTemplate.startDate)
          : new Date()
      );
      form.setValue(
        'endDate',
        selectedTemplate.endDate
          ? new Date(selectedTemplate.endDate)
          : new Date()
      );
      form.setValue('imageUrl', selectedTemplate.imageUrl || undefined);
      form.setValue(
        'moduleIds',
        selectedTemplate.modules?.map((m: any) => m.moduleId) || []
      );
    }
  }

  return (
    <div className="space-y-4">
      {/* Template Selection */}
      <div className="grid w-full grid-cols-1 space-y-4 gap-x-2 md:grid-cols-6">
        {/* Image Upload Field */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem className="md:col-span-2 lg:col-span-1">
              <FormLabel className="justify-center">
                {t('classrooms.actionDialog.fields.classroomImage')}
              </FormLabel>
              <FormControl>
                <DroppableImage
                  size="2xl"
                  value={field.value}
                  onChange={field.onChange}
                  uploadText={t('classrooms.actionDialog.fields.uploadImage')}
                  changeText={t('classrooms.actionDialog.fields.changeImage')}
                  helpText={t('classrooms.actionDialog.fields.imageUploadHelp')}
                  previewTitle={t(
                    'classrooms.actionDialog.fields.classroomImage'
                  )}
                  previewSubtitle={t(
                    'classrooms.actionDialog.fields.imagePreview'
                  )}
                  maxSize={5 * 1024 * 1024} // 5MB for cover images
                  accept={{
                    'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid w-full grid-cols-1 items-start gap-y-1 md:col-span-4 md:gap-y-0 lg:col-span-5">
          <FormField
            control={form.control}
            name="classroomTemplateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('classrooms.actionDialog.fields.template')}
                </FormLabel>
                <FormControl>
                  <Combobox
                    options={
                      templatesQuery.data?.classroomTemplates?.map(
                        (template: any) => ({
                          label: template.name,
                          value: template.id,
                        })
                      ) ?? []
                    }
                    value={field.value}
                    onValueChange={handleSelectedClassroomTemplateChange}
                    placeholder={t(
                      'classrooms.actionDialog.fields.selectTemplate'
                    )}
                    searchPlaceholder={t(
                      'classrooms.actionDialog.fields.searchTemplate'
                    )}
                    emptyText={t('classrooms.actionDialog.fields.noTemplate')}
                    className="w-full"
                    disabled={templatesQuery.isLoading}
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
                <FormLabel required>
                  {t('classrooms.actionDialog.fields.name')}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t(
                      'classrooms.actionDialog.fields.namePlaceholder'
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t('classrooms.actionDialog.fields.description')}
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder={t(
                  'classrooms.actionDialog.fields.descriptionPlaceholder'
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="items-start gap-4 space-y-6 md:grid md:grid-cols-3 md:space-y-0">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('classrooms.actionDialog.fields.startDate')}
              </FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value ?? undefined}
                  onSelect={field.onChange}
                  placeholder={t(
                    'classrooms.actionDialog.fields.startDatePlaceholder'
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
              <FormLabel required>
                {t('classrooms.actionDialog.fields.endDate')}
              </FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value ?? undefined}
                  onSelect={field.onChange}
                  placeholder={t(
                    'classrooms.actionDialog.fields.endDatePlaceholder'
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
              <FormLabel required>
                {t('classrooms.actionDialog.fields.capacity')}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  placeholder={t(
                    'classrooms.actionDialog.fields.capacityPlaceholder'
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
              <FormLabel required>
                {t('classrooms.actionDialog.fields.attendancePass')}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  min={0}
                  max={100}
                  placeholder={t(
                    'classrooms.actionDialog.fields.attendancePassPlaceholder'
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
              <FormLabel required>
                {t('classrooms.actionDialog.fields.assessmentPass')}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  min={0}
                  max={100}
                  placeholder={t(
                    'classrooms.actionDialog.fields.assessmentPassPlaceholder'
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
              <FormLabel required>
                {t('classrooms.actionDialog.fields.assignmentPass')}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  min={0}
                  max={100}
                  placeholder={t(
                    'classrooms.actionDialog.fields.assignmentPassPlaceholder'
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
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>
                {t('classrooms.actionDialog.fields.sendNotifications')}
              </FormLabel>
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
                {t('classrooms.actionDialog.fields.attendanceThreshold')}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  placeholder={t(
                    'classrooms.actionDialog.fields.attendanceThresholdPlaceholder'
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
                {t('classrooms.actionDialog.fields.reminderFrequency')}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  placeholder={t(
                    'classrooms.actionDialog.fields.reminderFrequencyPlaceholder'
                  )}
                  disabled={!form.watch('sendNotifications')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
