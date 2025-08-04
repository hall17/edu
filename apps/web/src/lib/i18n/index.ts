import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './en';
import { tr } from './tr';

const resources = {
  en,
  tr,
} as const;

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type LocaleResources = NestedKeyOf<typeof resources.en.translation>;
// export type LocaleResources = typeof resources.en.translation;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'tr',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
