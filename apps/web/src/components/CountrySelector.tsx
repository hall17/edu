import * as React from 'react';
import { useTranslation } from 'react-i18next';

import countriesData from '@/assets/countries.json';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

export interface Country {
  id: number;
  name: string;
  iso2: string;
  phoneCode: string;
  cities?: string[];
}

interface CountrySelectorProps {
  value?: string;
  onValueChange?: (countryCode: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CountrySelector({
  value,
  onValueChange,
  placeholder,
  className,
  disabled = false,
}: CountrySelectorProps) {
  const { t, i18n } = useTranslation();
  const countries = React.useMemo(() => {
    return countriesData as Country[];
  }, []);

  const countryOptions: ComboboxOption[] = React.useMemo(() => {
    return countries.map((country) => {
      // Use translation if available, otherwise use original name
      const translationKey = `countries.${country.iso2}`;
      const translatedName = t(translationKey, { defaultValue: country.name });

      return {
        label: translatedName,
        value: country.iso2,
      };
    });
  }, [countries, t, i18n.language]);

  return (
    <Combobox
      options={countryOptions}
      value={value}
      onValueChange={(value) => onValueChange?.(value)}
      placeholder={placeholder || t('countrySelector.selectCountry')}
      searchPlaceholder={t('countrySelector.searchCountries')}
      emptyText={t('countrySelector.noCountriesFound')}
      className={cn('w-full', className)}
      disabled={disabled}
    />
  );
}
