import { ScheduleType, ScoringType } from '@edusama/server';
import { Control, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AssessmentFormData } from '../AssessmentActionDialog';

import { DroppableImage } from '@/components/DroppableImage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import {
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
import { Textarea } from '@/components/ui/textarea';

interface BasicTabProps {
  form: UseFormReturn<AssessmentFormData>;
  subjects: Array<{ id: string; name: string }>;
  curriculums: Array<{ id: string; name: string }>;
  lessons: Array<{ id: string; name: string }>;
}

export function BasicTab({
  form,
  subjects,
  curriculums,
  lessons,
}: BasicTabProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Subject, Curriculum, Lesson Selection */}
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Subject</FormLabel>
              <Combobox
                options={subjects.map((subject) => ({
                  label: subject.name,
                  value: subject.id,
                }))}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select subject"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="curriculumId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curriculum</FormLabel>
              <Combobox
                options={curriculums.map((curriculum) => ({
                  label: curriculum.name,
                  value: curriculum.id,
                }))}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select curriculum"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lessonId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson</FormLabel>
              <Combobox
                options={lessons.map((lesson) => ({
                  label: lesson.name,
                  value: lesson.id,
                }))}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select lesson"
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Cover Image */}
      <FormField
        control={form.control}
        name="coverImageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="justify-center">
              {t('assessments.coverImage')}
            </FormLabel>
            <FormControl>
              <DroppableImage
                value={field.value}
                onChange={field.onChange}
                uploadText={t('common.uploadImage')}
                changeText={t('common.changeImage')}
                helpText={t('common.imageUploadHelp')}
                previewTitle={t('common.imagePreview')}
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

      {/* Title and Description */}
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Title</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scoringType"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t('assessments.scoringType')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ScoringType.MANUAL}>
                    {t('assessmentScoringTypes.MANUAL')}
                  </SelectItem>
                  <SelectItem value={ScoringType.AUTOMATIC}>
                    {t('assessmentScoringTypes.AUTOMATIC')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t('assessments.maxPoints')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduleType"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t('assessments.scheduleType')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ScheduleType.FLEXIBLE}>
                    {t('assessmentScheduleTypes.FLEXIBLE')}
                  </SelectItem>
                  <SelectItem value={ScheduleType.STRICT}>
                    {t('assessmentScheduleTypes.STRICT')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('assessments.duration')} (minutes)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="sendNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-y-0 space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t('assessments.sendNotifications')}</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-y-0 space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t('assessments.isPublic')}</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notificationFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('assessments.notificationFrequency')} (hours)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
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
