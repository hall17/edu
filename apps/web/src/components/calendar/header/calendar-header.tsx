import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

import Views from './view-tabs';

import {
  slideFromLeft,
  slideFromRight,
  transition,
} from '@/components/calendar/animations';
import { useCalendar } from '@/components/calendar/contexts/calendar-context';
import { DateNavigator } from '@/components/calendar/header/date-navigator';
import FilterEvents from '@/components/calendar/header/filter';
import { TodayButton } from '@/components/calendar/header/today-button';
import { UserSelect } from '@/components/calendar/header/user-select';
import { Settings } from '@/components/calendar/settings/settings';
import { Button } from '@/components/ui/button';

export function CalendarHeader() {
  const {
    view,
    events,
    onClickAddEvent,
    addEventButtonText,
    availableViews,
    allowAddEvent,
  } = useCalendar();

  return (
    <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <motion.div
        className="flex items-center gap-3"
        variants={slideFromLeft}
        initial="initial"
        animate="animate"
        transition={transition}
      >
        <TodayButton />
        <DateNavigator view={view} events={events} />
      </motion.div>

      <motion.div
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5"
        variants={slideFromRight}
        initial="initial"
        animate="animate"
        transition={transition}
      >
        <div className="options flex flex-wrap items-center gap-4 md:gap-2">
          <FilterEvents />
          <Views />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5">
          {/* <UserSelect /> */}

          {allowAddEvent && onClickAddEvent && (
            <Button onClick={() => onClickAddEvent(new Date())}>
              <Plus className="h-4 w-4" />
              {addEventButtonText}
            </Button>
          )}
        </div>
        {/* <Settings /> */}
      </motion.div>
    </div>
  );
}
