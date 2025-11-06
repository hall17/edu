import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'minimal';
}

export function TimeInput({
  value,
  onChange,
  className,
  disabled = false,
  variant = 'default',
}: TimeInputProps) {
  const [hours, minutes] = value.split(':');

  function handleHourChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value;
    const numericValue = parseInt(inputValue) || 0;

    // if (numericValue > 99) {
    //   numericValue = Number(numericValue.toString().slice(-1));
    // }

    // Allow empty input or valid hour range
    if (inputValue === '' || (numericValue >= 0 && numericValue <= 23)) {
      const paddedHour =
        inputValue === '' ? '00' : numericValue.toString().padStart(2, '0');
      onChange(`${paddedHour}:${minutes}`);
    }
  }

  function handleMinuteChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value;
    const numericValue = parseInt(inputValue) || 0;

    // Allow empty input or valid minute range
    if (inputValue === '' || (numericValue >= 0 && numericValue <= 59)) {
      const paddedMinute =
        inputValue === '' ? '00' : numericValue.toString().padStart(2, '0');
      onChange(`${hours}:${paddedMinute}`);
    }
  }

  function handleHourBlur() {
    const numericValue = parseInt(hours ?? '0') || 0;
    const clampedValue = Math.min(Math.max(numericValue, 0), 23);
    const paddedHour = clampedValue.toString().padStart(2, '0');
    onChange(`${paddedHour}:${minutes}`);
  }

  function handleMinuteBlur() {
    const numericValue = parseInt(minutes ?? '0') || 0;
    const clampedValue = Math.min(Math.max(numericValue, 0), 59);
    const paddedMinute = clampedValue.toString().padStart(2, '0');
    onChange(`${hours}:${paddedMinute}`);
  }

  return (
    <div
      className={cn(
        variant === 'default' &&
          'border-border focus-within:ring-ring bg-background rounded-lg border focus-within:ring-1',
        'flex items-center',
        className
      )}
    >
      <Input
        type="number"
        min="0"
        max="23"
        value={hours}
        onChange={handleHourChange}
        onBlur={handleHourBlur}
        disabled={disabled}
        className="w-10 [appearance:textfield] border-none bg-transparent !px-0 text-center shadow-none !ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        placeholder="HH"
      />
      <span className="text-muted-foreground px-1">:</span>
      <Input
        type="number"
        min="0"
        max="59"
        value={minutes}
        onChange={handleMinuteChange}
        onBlur={handleMinuteBlur}
        disabled={disabled}
        className="w-10 [appearance:textfield] border-none bg-transparent !px-0 text-center shadow-none !ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        placeholder="MM"
      />
    </div>
  );
}
