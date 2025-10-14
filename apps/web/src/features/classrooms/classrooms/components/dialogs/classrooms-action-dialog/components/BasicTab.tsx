import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormData } from '../ClassroomsActionDialog';

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

interface BasicTabProps {
  form: UseFormReturn<FormData>;
  templatesQuery: any;
  handleSelectedClassroomTemplateChange: (templateId: string) => void;
}

export function BasicTab({
  form,
  templatesQuery,
  handleSelectedClassroomTemplateChange,
}: BasicTabProps) {
  const { t } = useTranslation();

  return (
    <TabsContent value="basic" className="space-y-4">
      {/* Template Selection */}
      {/* Image Upload Field */}
      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <DroppableImage
            value={field.value}
            onChange={field.onChange}
            uploadText={t('classrooms.actionDialog.fields.uploadImage')}
            changeText={t('classrooms.actionDialog.fields.changeImage')}
            helpText={t('classrooms.actionDialog.fields.imageUploadHelp')}
            previewTitle={t('classrooms.actionDialog.fields.classroomImage')}
            previewSubtitle={t('classrooms.actionDialog.fields.imagePreview')}
          />
        )}
      />
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
                placeholder={t('classrooms.actionDialog.fields.selectTemplate')}
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
      <div className="items-start gap-4 space-y-6 md:grid md:grid-cols-2 md:space-y-0">
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
    </TabsContent>
  );
}
