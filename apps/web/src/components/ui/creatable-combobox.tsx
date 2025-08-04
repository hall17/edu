import { CheckIcon, ChevronsUpDownIcon, X } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface CreatableComboboxOption {
  label: string;
  value: string;
}

interface CreatableComboboxProps {
  options: CreatableComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  createText?: string;
  className?: string;
  disabled?: boolean;
}

export function CreatableCombobox({
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  createText,
  className,
  disabled = false,
}: CreatableComboboxProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const selectedOption = options.find((option) => option.value === value);
  const isCustomValue = value && !selectedOption;

  // Filter options based on input
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const displayValue = selectedOption?.label || value || '';

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === value) {
      onValueChange?.('');
    } else {
      onValueChange?.(selectedValue);
    }
    setOpen(false);
    setInputValue('');
  };

  const handleCreateNew = () => {
    if (inputValue.trim()) {
      onValueChange?.(inputValue.trim());
      setOpen(false);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === 'Enter' &&
      inputValue.trim() &&
      filteredOptions.length === 0
    ) {
      e.preventDefault();
      handleCreateNew();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            !displayValue && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          {displayValue || placeholder || t('combobox.selectOption')}
          <div className="flex items-center">
            {displayValue && (
              <div
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  onValueChange?.('');
                }}
              >
                <X className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </div>
            )}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder || t('combobox.search')}
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            {filteredOptions.length === 0 && inputValue ? (
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 py-2">
                  <span className="text-muted-foreground text-sm">
                    {emptyText || t('combobox.noOptionFound')}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateNew}
                    className="text-sm"
                  >
                    {createText
                      ? t(createText as any, { name: inputValue })
                      : `Create "${inputValue}"`}
                  </Button>
                </div>
              </CommandEmpty>
            ) : (
              <>
                {filteredOptions.length === 0 && (
                  <CommandEmpty>
                    {emptyText || t('combobox.noOptionFound')}
                  </CommandEmpty>
                )}
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      keywords={[option.label]}
                      onSelect={handleSelect}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                  {inputValue &&
                    !filteredOptions.some(
                      (option) =>
                        option.label.toLowerCase() === inputValue.toLowerCase()
                    ) && (
                      <CommandItem
                        value={inputValue}
                        onSelect={() => handleCreateNew()}
                        className="text-primary"
                      >
                        <CheckIcon className="mr-2 h-4 w-4 opacity-0" />
                        {createText
                          ? t(createText as any, { name: inputValue })
                          : `Create "${inputValue}"`}
                      </CommandItem>
                    )}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
