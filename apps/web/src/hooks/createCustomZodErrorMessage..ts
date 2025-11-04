import { TFunction } from 'i18next';
import z from 'zod';

export function createCustomZodErrorMessage(
  iss: z.core.$ZodIssue,
  t: TFunction
) {
  switch (iss.code) {
    case 'invalid_format':
    case 'invalid_type':
    case 'invalid_value':
      if (!iss.input) {
        return {
          ...iss,
          message: t('common.requiredField'),
        };
      }
      if ('format' in iss) {
        if (iss.format === 'url') {
          return {
            ...iss,
            message: t('common.invalidUrl'),
          };
        } else if (iss.format === 'email') {
          return {
            ...iss,
            message: t('common.invalidEmail'),
          };
        }
      }
      return {
        ...iss,
        message: t('common.invalidValue'),
      };
    case 'too_small': {
      const minimum = iss.minimum as number;
      if (iss.origin === 'string') {
        if (minimum === 1) {
          return {
            path: iss.path,
            message: t('common.requiredField'),
          };
        }
        return {
          ...iss,
          message: t('common.stringValueMinLengthError', {
            count: minimum,
          }),
        };
      } else if (iss.origin === 'number') {
        return {
          ...iss,
          message: t('common.numberValueMinError', {
            count: minimum,
          }),
        };
      } else {
        return {
          ...iss,
          message: t('common.requiredField'),
        };
      }
    }
    case 'too_big': {
      const maximum = iss.maximum as number;

      if (iss.origin === 'string') {
        return {
          ...iss,
          message: t('common.stringValueMaxLengthError', {
            count: maximum,
          }),
        };
      } else if (iss.origin === 'number') {
        return {
          ...iss,
          message: t('common.numberValueMaxError', {
            count: maximum,
          }),
        };
      } else {
        return {
          ...iss,
          message: t('common.invalidValue'),
        };
      }
    }
  }

  return {
    ...iss,
    message: t('common.anErrorOccurred'),
  };
}
