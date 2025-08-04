import z from 'zod';
import { CountryCode } from '../types';

export function getNationalIdSchema(countryCode: CountryCode) {
  // International passport validation - flexible alphanumeric format
  const passportRegex = /^[A-Z0-9]{6,12}$/;
  const genericNationalIdRegex = /^[A-Z0-9\-]+$/;

  const genericSchema = z
    .string()
    .min(5, 'National ID must be at least 5 characters')
    .max(20, 'National ID must not exceed 20 characters')
    .regex(
      genericNationalIdRegex,
      'National ID must contain only letters, numbers, and hyphens'
    )
    .or(
      z
        .string()
        .regex(
          passportRegex,
          'Passport number must contain only letters and numbers (A-Z, 0-9)'
        )
    );

  // National ID validation (country-specific)
  switch (countryCode) {
    case 'TR':
      const turkishNationalIdRegex = /^(\d{11})$/;
      return z
        .string()
        .regex(
          turkishNationalIdRegex,
          'Turkish National ID must be exactly 11 digits'
        );
    case 'US':
      const usSsnRegex = /^(\d{3})-?(\d{2})-?(\d{4})$/;
      return z
        .string()
        .regex(usSsnRegex, 'US SSN must be in format XXX-XX-XXXX or XXXXXXXXXX')
        .or(genericSchema);
    case 'GB':
      const ukNinRegex = /^[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z]\d{6}[A-D]$/;
      return z
        .string()
        .regex(
          ukNinRegex,
          'UK National Insurance Number must be in format AB123456C'
        )
        .or(genericSchema);
    default:
      // Generic national ID validation for other countries
      return genericSchema;
  }
}
