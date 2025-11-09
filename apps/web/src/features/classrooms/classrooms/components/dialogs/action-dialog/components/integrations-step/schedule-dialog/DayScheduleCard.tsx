import { DayOfWeek } from '@edusama/common';
import { useTranslation } from 'react-i18next';

import { ClassroomFormDataIntegrationSchedule } from '../../../classroomFormSchema';

import { TimeInput } from '@/components/TimeInput';
import { CardTitle } from '@/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemHeader,
} from '@/components/ui/item';
import { Switch } from '@/components/ui/switch';
import { parseHourAndMinutesUTC } from '@/utils';
import { set, setHours } from 'date-fns';

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

interface DayScheduleCardProps {
  schedule?: ClassroomFormDataIntegrationSchedule;
  day: DayOfWeek;
  addSchedule: (schedule: ClassroomFormDataIntegrationSchedule) => void;
  updateSchedule: (schedule: ClassroomFormDataIntegrationSchedule) => void;
  deleteSchedule: (schedule: ClassroomFormDataIntegrationSchedule) => void;
}

export function DayScheduleCard({
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
        startTime: setHours(new Date(), 9),
        endTime: setHours(new Date(), 10),
        isActive: true,
      };

      addSchedule(scheduleData);
    } else {
      deleteSchedule(schedule!);
    }
  }

  return (
    <Item variant="outline" className="p-2">
      <ItemContent>
        <ItemHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="min-w-20 text-base">
                {t(`days.${day}`)}
              </CardTitle>
              {schedule && (
                <>
                  <TimeInput
                    value={`${startHour}:${startMinute}`}
                    onChange={(value) => {
                      const [hours, minutes] = value.split(':');
                      const updatedSchedule = {
                        ...schedule!,
                        startTime: set(new Date(), {
                          hours: hours ? parseInt(hours) : 0,
                          minutes: minutes ? parseInt(minutes) : 0,
                        }),
                      };
                      updateSchedule(updatedSchedule);
                    }}
                  />
                  <TimeInput
                    value={`${endHour}:${endMinute}`}
                    onChange={(value) => {
                      const [hours, minutes] = value.split(':');
                      const updatedSchedule = {
                        ...schedule!,
                        endTime: set(new Date(), {
                          hours: hours ? parseInt(hours) : 0,
                          minutes: minutes ? parseInt(minutes) : 0,
                        }),
                      };
                      updateSchedule(updatedSchedule);
                    }}
                  />
                </>
              )}
            </div>
          </div>
          {schedule && (
            <span className="text-muted-foreground text-sm">
              {totalTime.hours > 0 && totalTime.minutes > 0
                ? t('classrooms.actionDialog.integrations.totalTime', {
                    hours: totalTime.hours,
                    minutes: totalTime.minutes,
                  })
                : totalTime.hours > 0
                  ? t(
                      'classrooms.actionDialog.integrations.totalTimeHoursOnly',
                      {
                        hours: totalTime.hours,
                      }
                    )
                  : t(
                      'classrooms.actionDialog.integrations.totalTimeMinutesOnly',
                      {
                        minutes: totalTime.minutes,
                      }
                    )}
            </span>
          )}
        </ItemHeader>
      </ItemContent>
      <ItemActions>
        <Switch
          checked={!!schedule}
          onCheckedChange={handleActiveChange}
          size="md"
        />
      </ItemActions>
    </Item>
  );
}
