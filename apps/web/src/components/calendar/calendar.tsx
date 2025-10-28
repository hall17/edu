import { IEvent } from './interfaces';
import { TCalendarView } from './types';

import { CalendarBody } from '@/components/calendar/calendar-body';
import {
  CalendarProvider,
  CalendarProviderProps,
} from '@/components/calendar/contexts/calendar-context';
import { DndProvider } from '@/components/calendar/contexts/dnd-context';
import { CalendarHeader } from '@/components/calendar/header/calendar-header';

export function Calendar(props: CalendarProviderProps) {
  return (
    <CalendarProvider
      availableViews={props.availableViews}
      events={props.events}
      users={[]}
      view={props.view}
      addEventButtonText={props.addEventButtonText}
      onClickAddEvent={props.onClickAddEvent}
      onClickEditEvent={props.onClickEditEvent}
      onClickRemoveEvent={props.onClickRemoveEvent}
      onClickEventCard={props.onClickEventCard}
    >
      <DndProvider showConfirmation={false}>
        <div className="w-full rounded-xl border">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}
