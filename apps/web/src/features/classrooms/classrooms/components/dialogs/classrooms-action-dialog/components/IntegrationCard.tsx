import { ClockIcon, Link, TrashIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormData } from '../ClassroomsActionDialog';

import { ScheduleDialog } from './ScheduleDialog';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Subject, trpc } from '@/lib/trpc';

interface IntegrationCardProps {
  index: number;
  form: UseFormReturn<FormData>;
  subjects: Subject[];
  selectedSubjectIds: string[];
  onRemove: () => void;
  canRemove: boolean;
  isLoading: boolean;
}

export function IntegrationCard({
  index,
  form,
  subjects,
  selectedSubjectIds,
  onRemove,
  canRemove,
  isLoading,
}: IntegrationCardProps) {
  const { t } = useTranslation();
  const selectedSubjectId = form.watch(`integrations.${index}.subjectId`);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const curriculums = useMemo(() => {
    return (
      subjects.find((subject) => subject.id === selectedSubjectId)
        ?.curriculums || []
    );
  }, [subjects, selectedSubjectId]);

  const teachers = useMemo(() => {
    return (
      subjects.find((subject) => subject.id === selectedSubjectId)?.teachers ||
      []
    );
  }, [subjects, selectedSubjectId]);

  function handleSubjectChange(subjectId: string) {
    form.setValue(`integrations.${index}.subjectId`, subjectId);
    form.setValue(`integrations.${index}.curriculumId`, '');
    form.setValue(`integrations.${index}.teacherId`, null);
  }
  // Check if current selected subject is already selected in another integration
  const isCurrentSubjectAlreadySelected =
    selectedSubjectId &&
    selectedSubjectIds.filter((id) => id === selectedSubjectId).length > 1;

  const availableSubjects = subjects.filter(
    (subject) =>
      !selectedSubjectIds.includes(subject.id) ||
      subject.id === selectedSubjectId
  );

  function handleCurriculumChange(curriculumId: string) {
    form.setValue(`integrations.${index}.curriculumId`, curriculumId);
  }

  function handleTeacherChange(teacherId: string | null) {
    form.setValue(`integrations.${index}.teacherId`, teacherId);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('classrooms.actionDialog.integrations.integrationTitle', {
            number: index + 1,
          })}
        </CardTitle>
        <CardAction className="self-center">
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowScheduleDialog(true)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ClockIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t('classrooms.actionDialog.integrations.manageSchedule')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    disabled={!canRemove}
                    className="text-destructive hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {!canRemove
                    ? t(
                        'classrooms.actionDialog.integrations.cannotRemoveLastIntegration'
                      )
                    : t(
                        'classrooms.actionDialog.integrations.deleteIntegration'
                      )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name={`integrations.${index}.subjectId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('classrooms.actionDialog.integrations.subject')}
              </FormLabel>
              <FormControl>
                <Combobox
                  options={availableSubjects.map((subject) => ({
                    label: subject.name,
                    value: subject.id,
                  }))}
                  value={field.value}
                  onValueChange={handleSubjectChange}
                  placeholder={t(
                    'classrooms.actionDialog.integrations.selectSubject'
                  )}
                  searchPlaceholder={t(
                    'classrooms.actionDialog.integrations.searchSubject'
                  )}
                  emptyText={
                    availableSubjects.length === 0 && subjects.length > 0
                      ? t(
                          'classrooms.actionDialog.integrations.subjectAlreadySelected'
                        )
                      : t('classrooms.actionDialog.integrations.noSubjects')
                  }
                  className="w-full"
                  disabled={isLoading}
                />
              </FormControl>
              {isCurrentSubjectAlreadySelected && (
                <p className="text-destructive text-sm">
                  {t(
                    'classrooms.actionDialog.integrations.subjectAlreadySelected'
                  )}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`integrations.${index}.curriculumId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('classrooms.actionDialog.integrations.curriculum')}
              </FormLabel>
              <FormControl>
                <Combobox
                  options={
                    curriculums?.map((curriculum) => ({
                      label: curriculum.name,
                      value: curriculum.id,
                    })) || []
                  }
                  value={field.value}
                  onValueChange={handleCurriculumChange}
                  placeholder={t(
                    'classrooms.actionDialog.integrations.selectCurriculum'
                  )}
                  searchPlaceholder={t(
                    'classrooms.actionDialog.integrations.searchCurriculum'
                  )}
                  emptyText={t(
                    'classrooms.actionDialog.integrations.noCurriculums'
                  )}
                  className="w-full"
                  disabled={!selectedSubjectId || isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`integrations.${index}.teacherId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('classrooms.actionDialog.integrations.teacher')}
              </FormLabel>
              <FormControl>
                <Combobox
                  options={teachers.map(({ teacher }) => ({
                    label: `${teacher.firstName} ${teacher.lastName}`,
                    value: teacher.id,
                  }))}
                  value={field.value || ''}
                  onValueChange={(value) => handleTeacherChange(value || null)}
                  placeholder={t(
                    'classrooms.actionDialog.integrations.selectTeacher'
                  )}
                  searchPlaceholder={t(
                    'classrooms.actionDialog.integrations.searchTeacher'
                  )}
                  emptyText={t(
                    'classrooms.actionDialog.integrations.noTeachers'
                  )}
                  className="w-full"
                  disabled={!selectedSubjectId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`integrations.${index}.accessLink`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('classrooms.actionDialog.integrations.accessLink')}
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Link className="text-muted-foreground size-4" />
                  <Input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>

      <ScheduleDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        integrationIndex={index}
        form={form}
      />
    </Card>
  );
}
