import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import countries from '@/assets/countries.json';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface Country {
  id: number;
  name: string;
  iso2: string;
  phoneCode: string;
  cities?: string[];
}

interface PhoneInputProps {
  value?: string;
  onValueChange: (value: string) => void;
  country?: Country;
  onCountryChange?: (countryCode: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  defaultCountry?: string;
}

export function PhoneInput({
  value,
  onValueChange,
  country,
  onCountryChange,
  placeholder,
  className,
  disabled = false,
}: PhoneInputProps) {
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn('flex gap-5', className)}>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[100px] shrink-0 justify-between"
            disabled={disabled}
          >
            {country ? (
              <div className="flex items-center gap-1">
                <span className="text-xs opacity-70">{country.iso2}</span>
                <span className="text-sm">+{country.phoneCode}</span>
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">
                {t('phoneInput.selectCountry', 'Select country')}
              </span>
            )}
            <ChevronsUpDownIcon className="-ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder={t(
                'phoneInput.searchCountries',
                'Search by country, code, or phone code...'
              )}
            />
            <CommandList>
              <CommandEmpty>
                {t('phoneInput.noCountriesFound', 'No countries found')}
              </CommandEmpty>
              <CommandGroup>
                {countries.map((c) => (
                  <CommandItem
                    key={c.iso2}
                    value={c.iso2}
                    keywords={[
                      c.name,
                      c.iso2,
                      c.phoneCode,
                      `+${c.phoneCode}`,
                      c.iso2.toLowerCase(),
                      c.name.toLowerCase(),
                    ]}
                    onSelect={(currentValue) => {
                      onCountryChange?.(currentValue);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4 text-green-500',
                        country?.iso2 === c.iso2 ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-70">{c.iso2}</span>
                      <span className="text-sm">+{c.phoneCode}</span>
                      <span className="text-sm">{c.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Input
        type="tel"
        value={value || ''}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={
          placeholder || t('phoneInput.enterPhoneNumber', 'Enter phone number')
        }
        className="flex-1"
        disabled={disabled}
      />
    </div>
  );
}
