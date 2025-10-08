import { DayOfWeek } from '@edusama/server';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormData, Schedule } from '../ClassroomsActionDialog';

import { TimeInput } from '@/components/TimeInput';
import { TimeWheelPicker } from '@/components/TimeWheelPicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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

function calculateTotalTime(
  startHour: string,
  startMinute: string,
  endHour: string,
  endMinute: string
) {
  const startTotalMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
  const endTotalMinutes = parseInt(endHour) * 60 + parseInt(endMinute);

  let totalMinutes = endTotalMinutes - startTotalMinutes;

  // Handle case where end time is on the next day
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60; // Add 24 hours in minutes
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integrationIndex: number;
  form: UseFormReturn<FormData>;
}

export function ScheduleDialog({
  open,
  onOpenChange,
  integrationIndex,
  form,
}: ScheduleDialogProps) {
  const { t } = useTranslation();
  const currentSchedules = form.getValues(
    `integrations.${integrationIndex}.schedules`
  );
  const [schedules, setSchedules] = useState(currentSchedules ?? []);

  function addSchedule(schedule: Schedule) {
    setSchedules([...schedules, schedule]);
  }

  function updateSchedule(schedule: Schedule) {
    setSchedules(
      schedules.map((s) => (s.dayOfWeek === schedule.dayOfWeek ? schedule : s))
    );
  }

  function deleteSchedule(schedule: Schedule) {
    setSchedules(schedules.filter((s) => s.dayOfWeek !== schedule.dayOfWeek));
  }

  function handleSaveChanges() {
    console.log('schedules', schedules);
    form.setValue(`integrations.${integrationIndex}.schedules`, schedules);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.close')}
          </Button>
          <Button onClick={handleSaveChanges}>{t('common.saveChanges')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DayScheduleCardProps {
  schedule?: Schedule;
  day: DayOfWeek;
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (schedule: Schedule) => void;
  deleteSchedule: (schedule: Schedule) => void;
}

function DayScheduleCard({
  schedule,
  day,
  addSchedule,
  updateSchedule,
  deleteSchedule,
}: DayScheduleCardProps) {
  const { t } = useTranslation();
  const startTime = schedule?.startTime
    ? (parseHourAndMinutesUTC(schedule.startTime) ?? {
        hours: '09',
        minutes: '00',
      })
    : { hours: '09', minutes: '00' };
  const endTime = schedule?.endTime
    ? (parseHourAndMinutesUTC(schedule.endTime) ?? {
        hours: '10',
        minutes: '00',
      })
    : { hours: '10', minutes: '00' };
  const startHour = startTime.hours;
  const startMinute = startTime.minutes;
  const endHour = endTime.hours;
  const endMinute = endTime.minutes;

  const totalTime = calculateTotalTime(
    startHour,
    startMinute,
    endHour,
    endMinute
  );

  function handleActiveChange(checked: boolean) {
    if (checked) {
      const scheduleData = {
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '10:00',
        isActive: true,
      };

      addSchedule(scheduleData);
    } else {
      deleteSchedule(schedule!);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{t(`days.${day}`)}</CardTitle>
            {schedule && (
              <>
                <TimeInput
                  value={`${startHour}:${startMinute}`}
                  onChange={(value) => {
                    const updatedSchedule = {
                      ...schedule!,
                      startTime: value,
                    };
                    updateSchedule(updatedSchedule);
                  }}
                />
                <TimeInput
                  value={`${endHour}:${endMinute}`}
                  onChange={(value) => {
                    const updatedSchedule = {
                      ...schedule!,
                      endTime: value,
                    };
                    updateSchedule(updatedSchedule);
                  }}
                />
              </>
            )}
          </div>
          <Switch
            checked={!!schedule}
            onCheckedChange={handleActiveChange}
            size="md"
          />
        </div>
        {schedule && (
          <span className="text-muted-foreground text-sm">
            {totalTime.hours > 0 && totalTime.minutes > 0
              ? t('classrooms.actionDialog.integrations.totalTime', {
                  hours: totalTime.hours,
                  minutes: totalTime.minutes,
                })
              : totalTime.hours > 0
                ? t('classrooms.actionDialog.integrations.totalTimeHoursOnly', {
                    hours: totalTime.hours,
                  })
                : t(
                    'classrooms.actionDialog.integrations.totalTimeMinutesOnly',
                    {
                      minutes: totalTime.minutes,
                    }
                  )}
          </span>
        )}
      </CardHeader>

      {schedule && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                {t('classrooms.actionDialog.integrations.startTime')}
              </label>
              <TimeWheelPicker
                value={`${startHour}:${startMinute}`}
                onChange={(value) => {
                  const updatedSchedule = {
                    ...schedule,
                    startTime: value,
                  };
                  updateSchedule(updatedSchedule);
                }}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                {t('classrooms.actionDialog.integrations.endTime')}
              </label>
              <TimeWheelPicker
                value={`${endHour}:${endMinute}`}
                onChange={(value) => {
                  const updatedSchedule = {
                    ...schedule,
                    endTime: value,
                  };
                  updateSchedule(updatedSchedule);
                }}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
