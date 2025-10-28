import z from 'zod';

import type { TEventColor } from '@/components/calendar/types';
import { ClassroomIntegrationSession } from '@/lib/trpc';

// const eventSchema = z.object({
//   type: z.enum(['session','assessment','other']),
//   data: z.

export interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
}

export interface IEvent {
  id: string;
  type?: 'session' | 'assessment' | 'other';
  data?: ClassroomIntegrationSession;
  startDate: string;
  endDate: string;
  title: string;
  color: TEventColor;
  description: string;
  user: any;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
