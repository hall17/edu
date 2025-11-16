import { DeviceCondition, DeviceStatus, DeviceType } from '@edusama/common';
import {
  Monitor,
  Laptop,
  Smartphone,
  Tablet,
  Printer,
  Router,
  Scan,
} from 'lucide-react';

export const statusTypes = new Map<DeviceStatus, string>([
  [
    DeviceStatus.ASSIGNED,
    'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
  ],
  [
    DeviceStatus.AVAILABLE,
    'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
  ],
  [
    DeviceStatus.IN_REPAIR,
    'bg-orange-100/30 text-orange-900 dark:text-orange-200 border-orange-200',
  ],
  [
    DeviceStatus.RETIRED,
    'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  ],
]);

export const conditionTypes = new Map<DeviceCondition, string>([
  [
    DeviceCondition.EXCELLENT,
    'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
  ],
  [
    DeviceCondition.GOOD,
    'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
  ],
  [
    DeviceCondition.FAIR,
    'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200',
  ],
  [
    DeviceCondition.POOR,
    'bg-orange-100/30 text-orange-900 dark:text-orange-200 border-orange-200',
  ],
  [
    DeviceCondition.DAMAGED,
    'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  ],
]);

export const deviceCategories: {
  label: string;
  value: DeviceType;
  icon: React.ElementType;
}[] = [
  {
    label: 'Desktop',
    value: 'DESKTOP',
    icon: Monitor,
  },
  {
    label: 'Laptop',
    value: 'LAPTOP',
    icon: Laptop,
  },
  {
    label: 'Mobile',
    value: 'SMARTPHONE',
    icon: Smartphone,
  },
  {
    label: 'Tablet',
    value: 'TABLET',
    icon: Tablet,
  },
  {
    label: 'Printer',
    value: 'PRINTER',
    icon: Printer,
  },
  {
    label: 'Other',
    value: 'OTHER',
    icon: Scan,
  },
] as const;
