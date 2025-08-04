import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import turkeyCities from '@/assets/turkey_cities.json';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CitySelectorProps {
  country?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CitySelector({
  country,
  value,
  onValueChange,
  placeholder,
  className,
  disabled = false,
}: CitySelectorProps) {
  const { t } = useTranslation();

  const cityOptions: ComboboxOption[] = useMemo(() => {
    if (!turkeyCities) return [];
    return turkeyCities.map((city) => ({
      label: city,
      value: city,
    }));
  }, [turkeyCities]);

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(event.target.value);
    },
    [onValueChange]
  );

  // If TR is selected and has cities, show searchable combobox
  if (country === 'TR') {
    return (
      <Combobox
        options={cityOptions}
        value={value}
        onValueChange={onValueChange}
        placeholder={
          placeholder || t('citySelector.selectCity', 'Select a city')
        }
        searchPlaceholder={t('citySelector.searchCities', 'Search cities...')}
        emptyText={t('citySelector.noCitiesFound', 'No cities found')}
        className={cn('w-full', className)}
        disabled={disabled}
      />
    );
  }

  // For all other countries, show free text input
  return (
    <Input
      type="text"
      value={value || ''}
      onChange={handleInputChange}
      placeholder={
        placeholder || t('citySelector.enterCity', 'Enter city name')
      }
      className={cn('w-full', className)}
      disabled={disabled}
    />
  );
}
