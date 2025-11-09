import { format, formatDate } from 'date-fns';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function DateTimePicker24h({
  value,
  onChange,
  placeholder,
}: {
  value: Date | undefined;
  onChange: (date: Date) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverContentRef = useRef<HTMLDivElement>(null);
  // const [isRendered, setIsRendered] = useState(false);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleTimeChange = (type: 'hour' | 'minute', newValue: string) => {
    if (newValue) {
      let now = dayjs(value).set(type, parseInt(newValue));
      if (!value) {
        if (type === 'hour') {
          now = now.set('minute', 0);
        } else if (type === 'minute') {
          now = now.set('hour', 9);
        }
      }
      onChange(now.toDate());
    }
  };

  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const observer = new MutationObserver(() => {
      const hourRadixScrollAreaViewport = hourScrollRef.current?.querySelector(
        '[data-slot="scroll-area-viewport"]'
      );
      const minuteRadixScrollAreaViewport =
        minuteScrollRef.current?.querySelector(
          '[data-slot="scroll-area-viewport"]'
        );

      if (hourRadixScrollAreaViewport && minuteRadixScrollAreaViewport) {
        observer.disconnect();

        if (value) {
          // Scroll to current hour
          let hourIndex = value.getHours();
          if (hourIndex > 2) {
            hourIndex = hourIndex - 2;
          }
          const scrollPosition = hourIndex * 36;
          hourRadixScrollAreaViewport!.scrollTop = scrollPosition;

          // Scroll to current minute
          const currentMinute = value.getMinutes();
          const minuteIndex = Math.floor(currentMinute / 5);
          const minuteScrollPosition = minuteIndex * 36;
          minuteRadixScrollAreaViewport!.scrollTop = minuteScrollPosition;
        } else {
          // move to 09:00
          const hourScrollPosition = 9 * 36;
          hourRadixScrollAreaViewport!.scrollTop = hourScrollPosition;
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isOpen]);

  console.log('value', value);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, 'dd/MM/yyyy HH:mm')
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" ref={popoverContentRef}>
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            <ScrollArea className="w-64 sm:w-auto" ref={hourScrollRef}>
              <div className="flex p-2 sm:flex-col">
                {hours.map((hour, index) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      value && value.getHours() === hour ? 'default' : 'ghost'
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange('hour', hour.toString())}
                  >
                    {index < 10 ? `0${hour}` : hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto" ref={minuteScrollRef}>
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      value && value.getMinutes() === minute
                        ? 'default'
                        : 'ghost'
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() =>
                      handleTimeChange('minute', minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
