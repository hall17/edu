import dayjs from 'dayjs';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useState } from 'react';

import { TimeWheelPicker } from './TimeWheelPicker';

import { TimeInput } from '@/components/TimeInput';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Pick date and time',
  disabled = false,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [timeValue, setTimeValue] = useState(
    value ? dayjs(value).format('HH:mm') : ''
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && timeValue) {
      const [hours, minutes] = timeValue.split(':');
      const newDate = dayjs(date)
        .hour(parseInt(hours))
        .minute(parseInt(minutes))
        .toDate();
      onChange(newDate);
    } else if (date) {
      onChange(date);
    }
  };

  const handleTimeChange = (time: string) => {
    setTimeValue(time);
    if (selectedDate && time) {
      const [hours, minutes] = time.split(':');
      const newDate = dayjs(selectedDate)
        .hour(parseInt(hours))
        .minute(parseInt(minutes))
        .toDate();
      onChange(newDate);
    }
  };

  const displayValue = value ? dayjs(value).format('DD/MM/YYYY') : '';

  return (
    <div className="flex gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'flex-1 justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? displayValue : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={disabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* <Clock className="absolute top-2.5 left-2 h-4 w-4 opacity-50" /> */}
      {/* <TimeInput
          value={timeValue}
          onChange={handleTimeChange}
          disabled={disabled}
          className="w-32 pl-8"
        /> */}
      <TimeWheelPicker
        value={timeValue}
        onChange={handleTimeChange}
        className="h-[60px] !w-[120px] [&>div]:h-[60px]"
      />
    </div>
  );
}
