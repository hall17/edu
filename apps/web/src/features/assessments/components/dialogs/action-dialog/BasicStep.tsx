import { ScheduleType, ScoringType } from '@edusama/common';
import { useQuery } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AssessmentFormData } from './AssessmentActionDialog';

import { DroppableImage } from '@/components/DroppableImage';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/multi-select';
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
import { trpc } from '@/lib/trpc';
import { DEFAULT_IMAGE_SIZE } from '@/utils/constants';

interface BasicStepProps {
  form: UseFormReturn<AssessmentFormData>;
}

export function BasicStep({ form }: BasicStepProps) {
  const { t } = useTranslation();

  const selectedSubjectId = form.watch('subjectId');
  const selectedCurriculumIds = form.watch('curriculumIds');

  const subjectsQuery = useQuery(
    trpc.subject.findAll.queryOptions({ all: true })
  );

  const subjects = subjectsQuery.data?.subjects ?? [];
  const selectedSubject = subjects.find(
    (subject) => subject.id === selectedSubjectId
  );
  const availableCurriculums = selectedSubject?.curriculums || [];

  const availableLessons = selectedCurriculumIds
    ? availableCurriculums
        .filter((curriculum) => selectedCurriculumIds.includes(curriculum.id))
        .flatMap((curriculum) => curriculum.lessons)
    : [];

  return (
    <div className="mt-8 space-y-8">
      {/* Subject, Curriculum, Lesson Selection */}
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
        <div className="col-span-2 grid w-full grid-cols-1 space-y-4 md:grid-cols-6">
          {/* Cover Image */}
          <div className="col-span-1">
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
                      size="2xl"
                      value={field.value}
                      onChange={field.onChange}
                      uploadText={t('common.uploadImage')}
                      changeText={t('common.changeImage')}
                      helpText={t('common.imageUploadHelp')}
                      previewTitle={t('common.imagePreview')}
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
          </div>
          {/* Title and Description */}
          <div className="col-span-5 grid w-full grid-cols-1 items-start gap-y-1 md:gap-y-0">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t('assessments.fields.title')}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('assessments.fields.description')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="col-span-2 grid grid-cols-1 items-start gap-4 space-y-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>
                  {t('assessments.fields.subject')}
                </FormLabel>
                <Combobox
                  options={subjects.map((subject) => ({
                    label: subject.name,
                    value: subject.id,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t('assessments.actionDialog.selectSubject')}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="curriculumIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('assessments.fields.curriculum')}</FormLabel>
                <MultiSelect
                  defaultValues={field.value as string[]}
                  onValuesChange={field.onChange}
                >
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue
                      placeholder={t(
                        'assessments.actionDialog.selectCurriculum'
                      )}
                    />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    {availableCurriculums?.map((curriculum) => (
                      <MultiSelectItem
                        key={curriculum.id}
                        value={curriculum.id}
                      >
                        {curriculum.name}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectContent>
                </MultiSelect>
                {/* <Combobox
                  options={availableCurriculums?.map((curriculum) => ({
                    label: curriculum.name,
                    value: curriculum.id,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t('assessments.actionDialog.selectCurriculum')}
                /> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lessonIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('assessments.fields.lesson')}</FormLabel>

                <MultiSelect
                  defaultValues={field.value as string[]}
                  onValuesChange={field.onChange}
                >
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue
                      placeholder={t('assessments.actionDialog.selectLesson')}
                    />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    {availableLessons?.map((lesson) => (
                      <MultiSelectItem key={lesson.id} value={lesson.id}>
                        {lesson.name}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectContent>
                </MultiSelect>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="scoringType"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t('assessments.scoringType')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('common.select')} />
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
                    <SelectValue placeholder={t('common.select')} />
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
