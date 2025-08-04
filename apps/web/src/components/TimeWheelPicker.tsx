import { WheelPicker, WheelPickerWrapper } from '@/components/ui/wheel-picker';
import type { WheelPickerOption } from '@/components/ui/wheel-picker';

const createArray = (length: number, add = 0): WheelPickerOption[] =>
  Array.from({ length }, (_, i) => {
    const value = i + add;
    const paddedValue = value.toString().padStart(2, '0');
    return {
      label: paddedValue,
      value: paddedValue,
    };
  });

const hourOptions = createArray(24);
const minuteOptions = createArray(60);

interface TimeWheelPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimeWheelPicker({
  value,
  onChange,
  className,
}: TimeWheelPickerProps) {
  const [hours, minutes] = value.split(':');

  function handleHourChange(hourValue: string) {
    onChange(`${hourValue}:${minutes}`);
  }

  function handleMinuteChange(minuteValue: string) {
    onChange(`${hours}:${minuteValue}`);
  }

  return (
    <WheelPickerWrapper className={className}>
      <WheelPicker
        visibleCount={12}
        options={hourOptions}
        value={hours}
        onValueChange={handleHourChange}
        infinite
      />
      <WheelPicker
        visibleCount={12}
        options={minuteOptions}
        value={minutes}
        onValueChange={handleMinuteChange}
        infinite
      />
    </WheelPickerWrapper>
  );
}
