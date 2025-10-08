import { DeviceCondition, DeviceStatus, DeviceType } from '@edusama/server';
import {
  IconDeviceDesktop,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconObjectScan,
  IconPrinter,
  IconRouter,
} from '@tabler/icons-react';

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
    icon: IconDeviceDesktop,
  },
  {
    label: 'Laptop',
    value: 'LAPTOP',
    icon: IconDeviceLaptop,
  },
  {
    label: 'Mobile',
    value: 'SMARTPHONE',
    icon: IconDeviceMobile,
  },
  {
    label: 'Tablet',
    value: 'TABLET',
    icon: IconDeviceTablet,
  },
  {
    label: 'Printer',
    value: 'PRINTER',
    icon: IconPrinter,
  },
  {
    label: 'Other',
    value: 'OTHER',
    icon: IconObjectScan,
  },
] as const;
