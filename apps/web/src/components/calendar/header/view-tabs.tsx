import { CalendarRange, List, Columns, Grid3X3, Grid2X2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useCalendar } from '../contexts/calendar-context';
import { TCalendarView } from '../types';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

function Views() {
  const { t } = useTranslation();
  const { view, setView, availableViews } = useCalendar();

  const tabs = [
    {
      nameKey: t('calendar.views.agenda'),
      value: 'agenda',
      icon: () => <CalendarRange className="h-4 w-4" />,
    },
    {
      nameKey: t('calendar.views.day'),
      value: 'day',
      icon: () => <List className="h-4 w-4" />,
    },
    {
      nameKey: t('calendar.views.week'),
      value: 'week',
      icon: () => <Columns className="h-4 w-4" />,
    },
    {
      nameKey: t('calendar.views.month'),
      value: 'month',
      icon: () => <Grid3X3 className="h-4 w-4" />,
    },
    {
      nameKey: t('calendar.views.year'),
      value: 'year',
      icon: () => <Grid2X2 className="h-4 w-4" />,
    },
  ];

  const filteredTabs = availableViews
    ? tabs.filter((tab) => availableViews.includes(tab.value as TCalendarView))
    : tabs;

  return (
    <Tabs
      value={view}
      onValueChange={(value) => setView(value as TCalendarView)}
      className="w-full gap-4 sm:w-auto"
    >
      <TabsList className="h-auto w-full gap-2 rounded-xl p-1">
        {filteredTabs.map(({ icon: Icon, nameKey, value }) => {
          const isActive = view === value;

          return (
            <motion.div
              key={value}
              layout
              className={cn(
                'flex h-8 items-center justify-center overflow-hidden rounded-md',
                isActive ? 'flex-1' : 'flex-none'
              )}
              onClick={() => setView(value as TCalendarView)}
              initial={false}
              animate={{
                width: isActive ? 120 : 32,
              }}
              transition={{
                type: 'tween',
                stiffness: 400,
                damping: 25,
              }}
            >
              <TabsTrigger value={value} asChild>
                <motion.div
                  className="flex h-8 w-full cursor-pointer items-center justify-center"
                  animate={{ filter: 'blur(0px)' }}
                  exit={{ filter: 'blur(2px)' }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <Icon />
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        className="font-medium"
                        initial={{ opacity: 0, scaleX: 0.8 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        style={{ originX: 0 }}
                      >
                        {t(nameKey as any)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </TabsTrigger>
            </motion.div>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

export default memo(Views);
