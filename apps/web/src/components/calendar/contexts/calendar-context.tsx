import React, { createContext, useContext, useState } from 'react';

import { useLocalStorage } from '@/components/calendar/hooks';
import type { IEvent, IUser } from '@/components/calendar/interfaces';
import type { TCalendarView, TEventColor } from '@/components/calendar/types';

interface CalendarSettings {
  badgeVariant: 'dot' | 'colored';
  view: TCalendarView;
  use24HourFormat: boolean;
  agendaModeGroupBy: 'date' | 'color';
}

const DEFAULT_SETTINGS: CalendarSettings = {
  badgeVariant: 'colored',
  view: 'day',
  use24HourFormat: true,
  agendaModeGroupBy: 'date',
};

export interface CalendarProviderProps {
  // calendar settings
  use24HourFormat?: boolean;
  badgeVariant?: CalendarSettings['badgeVariant'];
  view?: TCalendarView;
  agendaModeGroupBy?: 'date' | 'color';

  selectedDate?: Date;
  selectedColors?: TEventColor[];
  availableViews?: TCalendarView[];
  events: IEvent[];
  users?: IUser[];
  addEventButtonText: string;
  allowAddEvent?: boolean;
  onClickAddEvent?: (time: Date) => void;
  onClickEditEvent?: (eventId: string) => void;
  onClickRemoveEvent?: (eventId: string) => void;
  onClickEventCard: (eventId: string) => void;
}

function useProviderValue(props: CalendarProviderProps) {
  const { events, users } = props;

  const [badgeVariant, setBadgeVariant] = useState<'dot' | 'colored'>(
    props.badgeVariant ?? DEFAULT_SETTINGS.badgeVariant
  );
  const [view, setView] = useState<TCalendarView>(
    props.view ?? DEFAULT_SETTINGS.view
  );
  const [use24HourFormat, setUse24HourFormat] = useState<boolean>(
    props.use24HourFormat ?? DEFAULT_SETTINGS.use24HourFormat
  );
  const [agendaModeGroupBy, setAgendaModeGroupBy] = useState<'date' | 'color'>(
    props.agendaModeGroupBy ?? DEFAULT_SETTINGS.agendaModeGroupBy
  );

  const [selectedDate, setSelectedDate] = useState(
    props.selectedDate ?? new Date()
  );
  const [selectedUserId, setSelectedUserId] = useState<IUser['id'] | 'all'>(
    'all'
  );
  const [selectedColors, setSelectedColors] = useState<TEventColor[]>(
    props.selectedColors ?? []
  );

  const [allEvents, setAllEvents] = useState<IEvent[]>(events || []);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>(events || []);

  const toggleTimeFormat = () => {
    setUse24HourFormat((prev) => !prev);
  };

  const filterEventsBySelectedColors = (color: TEventColor) => {
    const isColorSelected = selectedColors.includes(color);
    const newColors = isColorSelected
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];

    if (newColors.length > 0) {
      const filtered = allEvents.filter((event) => {
        const eventColor = event.color || 'blue';
        return newColors.includes(eventColor);
      });
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(allEvents);
    }

    setSelectedColors(newColors);
  };

  const filterEventsBySelectedUser = (userId: IUser['id'] | 'all') => {
    setSelectedUserId(userId);
    if (userId === 'all') {
      setFilteredEvents(allEvents);
    } else {
      const filtered = allEvents.filter((event) => event.user.id === userId);
      setFilteredEvents(filtered);
    }
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const addEvent = (event: IEvent) => {
    setAllEvents((prev) => [...prev, event]);
    setFilteredEvents((prev) => [...prev, event]);
  };

  const updateEvent = (event: IEvent) => {
    const updated = {
      ...event,
      startDate: new Date(event.startDate).toISOString(),
      endDate: new Date(event.endDate).toISOString(),
    };

    setAllEvents((prev) => prev.map((e) => (e.id === event.id ? updated : e)));
    setFilteredEvents((prev) =>
      prev.map((e) => (e.id === event.id ? updated : e))
    );
  };

  const removeEvent = (eventId: string) => {
    setAllEvents((prev) => prev.filter((e) => e.id !== eventId));
    setFilteredEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const clearFilter = () => {
    setFilteredEvents(allEvents);
    setSelectedColors([]);
    setSelectedUserId('all');
  };

  return {
    ...props,
    view,
    setView,
    badgeVariant,
    setBadgeVariant,
    use24HourFormat,
    toggleTimeFormat,
    agendaModeGroupBy,
    setAgendaModeGroupBy,
    selectedDate,
    setSelectedDate: handleSelectDate,
    selectedUserId,
    setSelectedUserId,
    users,
    selectedColors,
    filterEventsBySelectedColors,
    filterEventsBySelectedUser,
    events: filteredEvents,
    addEvent,
    updateEvent,
    removeEvent,
    clearFilter,
  };
}

// const CalendarContext = createContext({} as ICalendarContext);
const CalendarContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function CalendarProvider(
  props: React.PropsWithChildren & CalendarProviderProps
) {
  const { children, ...rest } = props;
  const value = useProviderValue(rest);

  return (
    <CalendarContext.Provider value={value}>
      {props.children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);

  if (!context)
    throw new Error('useCalendar must be used within a CalendarProvider.');

  return context;
}
