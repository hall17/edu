import { DayOfWeek } from '@edusama/server';
import { eachDayOfInterval, format, set } from 'date-fns';
import { detailedDiff } from 'deep-object-diff';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useClassroomForm } from '../../../ClassroomFormContext';
import {
  type ClassroomFormData,
  type ClassroomFormDataIntegrationSchedule,
} from '../../../classroomFormSchema';

import { DayScheduleCard } from './DayScheduleCard';

import { UnsavedChangesDialog } from '@/components';
import { TimeInput } from '@/components/TimeInput';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemHeader,
} from '@/components/ui/item';
import { Switch } from '@/components/ui/switch';
import { ClassroomSessionFormData } from '@/lib/schemas/classroomSessionFormSchema';
import { parseHourAndMinutesUTC } from '@/utils';

const daysOfWeek = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integrationIndex: number;
}

export function ScheduleDialog({
  open,
  onOpenChange,
  integrationIndex,
}: ScheduleDialogProps) {
  const { t } = useTranslation();
  const { form } = useClassroomForm();
  const watchedIntegrations = form.watch('integrations');
  const integrationField = watchedIntegrations[integrationIndex];
  const currentSchedules = integrationField.schedules ?? [];

  const [schedules, setSchedules] = useState(currentSchedules ?? []);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  function addSchedule(schedule: ClassroomFormDataIntegrationSchedule) {
    setSchedules([...schedules, schedule]);
  }

  function updateSchedule(schedule: ClassroomFormDataIntegrationSchedule) {
    setSchedules(
      schedules.map((s) => (s.dayOfWeek === schedule.dayOfWeek ? schedule : s))
    );
  }

  function deleteSchedule(schedule: ClassroomFormDataIntegrationSchedule) {
    setSchedules(schedules.filter((s) => s.dayOfWeek !== schedule.dayOfWeek));
  }

  function handleSaveChanges() {
    form.setValue(`integrations.${integrationIndex}.schedules`, schedules);
    onOpenChange(false);
  }

  function handleDialogClose(state: boolean) {
    const diff = detailedDiff(currentSchedules ?? [], schedules);
    const isDirty =
      Object.keys(diff.updated).length > 0 ||
      Object.keys(diff.added).length > 0 ||
      Object.keys(diff.deleted).length > 0;

    if (!state && isDirty) {
      setShowConfirmDialog(true);
    } else {
      handleConfirmClose();
    }
  }

  function handleConfirmClose() {
    setShowConfirmDialog(false);
    setSchedules(currentSchedules ?? []);
    onOpenChange(false);
  }

  function handleCancelClose() {
    setShowConfirmDialog(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t('classrooms.actionDialog.integrations.scheduleTitle')}
            </DialogTitle>
            <DialogDescription>
              {t('classrooms.actionDialog.integrations.scheduleDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {daysOfWeek.map((day) => {
              const schedule = schedules.find(
                (schedule) => schedule.dayOfWeek === day
              );

              return (
                <DayScheduleCard
                  key={day}
                  schedule={schedule}
                  day={day}
                  addSchedule={addSchedule}
                  updateSchedule={updateSchedule}
                  deleteSchedule={deleteSchedule}
                />
              );
            })}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => handleDialogClose(false)}>
              {t('common.close')}
            </Button>
            <Button onClick={handleSaveChanges}>
              {t('common.saveChanges')}
            </Button>
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
