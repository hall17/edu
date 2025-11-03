import {
  addDays,
  format,
  isSameDay,
  parseISO,
  set,
  startOfWeek,
} from 'date-fns';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';

import {
  fadeIn,
  staggerContainer,
  transition,
} from '@/components/calendar/animations';
import { useCalendar } from '@/components/calendar/contexts/calendar-context';
import { DroppableArea } from '@/components/calendar/dnd/droppable-area';
import { groupEvents } from '@/components/calendar/helpers';
import type { IEvent } from '@/components/calendar/interfaces';
import { CalendarTimeline } from '@/components/calendar/views/week-and-day-view/calendar-time-line';
import { RenderGroupedEvents } from '@/components/calendar/views/week-and-day-view/render-grouped-events';
import { WeekViewMultiDayEventsRow } from '@/components/calendar/views/week-and-day-view/week-view-multi-day-events-row';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const AREA_HEIGHT = 48;
interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

export function CalendarWeekView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, use24HourFormat, onClickAddEvent, allowAddEvent } =
    useCalendar();

  const weekStart = startOfWeek(selectedDate, {
    locale: {
      options: {
        weekStartsOn: 1,
      },
    },
  });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!scrollAreaRef.current) return;

    const observer = new MutationObserver(() => {
      const scrollAreaViewport = scrollAreaRef.current?.querySelector(
        '[data-slot="scroll-area-viewport"]'
      );

      if (scrollAreaViewport) {
        observer.disconnect();

        // scroll to 08:00 in the scroll area AREA_HEIGHT * 2 * difference between 00:00 and 08:00
        const scrollPosition = AREA_HEIGHT * 2 * (7 - 0) - 10;
        scrollAreaViewport.scrollTop = scrollPosition;
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
      transition={transition}
    >
      <motion.div
        className="flex flex-col items-center justify-center border-b p-4 text-sm sm:hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        <p>Weekly view is not recommended on smaller devices.</p>
        <p>Please switch to a desktop device or use the daily view instead.</p>
      </motion.div>

      <motion.div className="flex-col sm:flex" variants={staggerContainer}>
        <div>
          <WeekViewMultiDayEventsRow
            selectedDate={selectedDate}
            multiDayEvents={multiDayEvents}
          />

          {/* Week header */}
          <motion.div
            className="relative z-20 flex border-b"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
          >
            {/* Time column header - responsive width */}
            <div className="w-18"></div>
            <div className="grid flex-1 grid-cols-7 border-l">
              {weekDays.map((day, index) => (
                <motion.span
                  key={index}
                  className="text-t-quaternary py-1 text-center text-xs font-medium sm:py-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, ...transition }}
                >
                  {/* Mobile: Show only day abbreviation and number */}
                  <span className="block sm:hidden">
                    {format(day, 'EEE').charAt(0)}
                    <span className="text-t-secondary block text-xs font-semibold">
                      {format(day, 'd')}
                    </span>
                  </span>
                  {/* Desktop: Show full format */}
                  <span className="hidden sm:inline">
                    {format(day, 'EE')}{' '}
                    <span className="text-t-secondary ml-1 font-semibold">
                      {format(day, 'd')}
                    </span>
                  </span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        <ScrollArea className="h-[700px]" type="always" ref={scrollAreaRef}>
          <div className="flex">
            {/* Hours column */}
            <motion.div className="relative w-18" variants={staggerContainer}>
              {hours.map((hour, index) => (
                <motion.div
                  key={hour}
                  className="relative"
                  style={{ height: AREA_HEIGHT * 2 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02, ...transition }}
                >
                  <div className="absolute -top-3 right-2 flex h-6 items-center">
                    {index !== 0 && (
                      <span className="text-t-quaternary text-xs">
                        {format(
                          new Date().setHours(hour, 0, 0, 0),
                          use24HourFormat ? 'HH:00' : 'h a'
                        )}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Week grid */}
            <motion.div
              className="relative flex-1 border-l"
              variants={staggerContainer}
            >
              <div className="grid grid-cols-7 divide-x">
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = singleDayEvents.filter(
                    (event) =>
                      isSameDay(parseISO(event.startDate), day) ||
                      isSameDay(parseISO(event.endDate), day)
                  );
                  const groupedEvents = groupEvents(dayEvents);

                  return (
                    <motion.div
                      key={dayIndex}
                      className="relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: dayIndex * 0.1, ...transition }}
                    >
                      {hours.map((hour, index) => (
                        <motion.div
                          key={hour}
                          className="relative"
                          style={{ height: AREA_HEIGHT * 2 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.01, ...transition }}
                        >
                          {index !== 0 && (
                            <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>
                          )}

                          <DroppableArea
                            date={day}
                            hour={hour}
                            minute={0}
                            className="absolute inset-x-0 top-0"
                            style={{ height: AREA_HEIGHT }}
                          >
                            {/* <AddEditEventDialog
                              startDate={day}
                              startTime={{ hour, minute: 0 }}
                            > */}
                            {onClickAddEvent && (
                              <div
                                role="button"
                                className="group hover:bg-secondary absolute inset-0 flex cursor-pointer items-center justify-center transition-colors"
                                onClick={() => {
                                  // construct time from day hour and minute with date-fns
                                  const time = set(new Date(day), {
                                    hours: hour,
                                    minutes: 0,
                                    seconds: 0,
                                  });
                                  onClickAddEvent(time);
                                }}
                              >
                                <Button
                                  variant="ghost"
                                  className="border opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                >
                                  <Plus className="h-4 w-4" />
                                  <span className="max-sm:hidden">
                                    Add Event
                                  </span>
                                </Button>
                              </div>
                            )}
                            {/* </AddEditEventDialog> */}
                          </DroppableArea>

                          <div className="border-b-tertiary pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>

                          <DroppableArea
                            date={day}
                            hour={hour}
                            minute={30}
                            className="absolute inset-x-0 bottom-0"
                            style={{ height: AREA_HEIGHT }}
                          >
                            {onClickAddEvent && (
                              <div
                                className="group hover:bg-secondary absolute inset-0 flex cursor-pointer items-center justify-center transition-colors"
                                onClick={() => {
                                  // construct time from day hour and minute with date-fns
                                  const time = set(new Date(day), {
                                    hours: hour,
                                    minutes: 30,
                                    seconds: 0,
                                  });
                                  onClickAddEvent(time);
                                }}
                              >
                                <Button
                                  variant="ghost"
                                  className="border opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                >
                                  <Plus className="h-4 w-4" />
                                  <span className="max-sm:hidden">
                                    Add Event
                                  </span>
                                </Button>
                              </div>
                            )}
                          </DroppableArea>
                        </motion.div>
                      ))}

                      <RenderGroupedEvents
                        groupedEvents={groupedEvents}
                        day={day}
                      />
                    </motion.div>
                  );
                })}
              </div>

              <CalendarTimeline />
            </motion.div>
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
}
