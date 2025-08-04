import { TFunction } from 'i18next';
import z from 'zod';

export function createCustomZodErrorMessage(
  iss: z.core.$ZodIssue,
  t: TFunction
) {
  console.log('iss', iss);
  switch (iss.code) {
    case 'invalid_format':
    case 'invalid_type':
    case 'invalid_value':
      console.log('iss.input', iss.input);
      if (!iss.input) {
        return {
          message: t('common.requiredField'),
        };
      }
      if ('format' in iss) {
        if (iss.format === 'url') {
          return {
            message: t('common.invalidUrl'),
          };
        } else if (iss.format === 'email') {
          return {
            message: t('common.invalidEmail'),
          };
        }
      }
      return {
        message: t('common.invalidValue'),
      };
    case 'too_small': {
      const minimum = iss.minimum as number;
      if (iss.origin === 'string') {
        if (minimum === 1) {
          return {
            message: t('common.requiredField'),
          };
        }
        return {
          message: t('common.stringValueMinLengthError', {
            count: minimum,
          }),
        };
      } else if (iss.origin === 'number') {
        return {
          message: t('common.numberValueMinError', {
            count: minimum,
          }),
        };
      } else {
        return {
          message: t('common.requiredField'),
        };
      }
    }
    case 'too_big': {
      const maximum = iss.maximum as number;

      if (iss.origin === 'string') {
        return {
          message: t('common.stringValueMaxLengthError', {
            count: maximum,
          }),
        };
      } else if (iss.origin === 'number') {
        return {
          message: t('common.numberValueMaxError', {
            count: maximum,
          }),
        };
      } else {
        return {
          message: t('common.invalidValue'),
        };
      }
    }
  }

  return {
    message: t('common.anErrorOccurred'),
  };
}
