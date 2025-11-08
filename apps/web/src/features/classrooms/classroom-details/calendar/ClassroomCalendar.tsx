import { addMinutes } from 'date-fns';
import { useTranslation } from 'react-i18next';

import {
  ClassroomCalendarProvider,
  useClassroomCalendarContext,
} from './ClassroomCalendarContext';
import { ClassroomCalendarDialogs } from './dialogs';

import { Loading } from '@/components';
import { Calendar } from '@/components/calendar/calendar';
import { IEvent } from '@/components/calendar/interfaces';

function ClassroomCalendarContent() {
  const { t } = useTranslation();

  const {
    setCurrentRow,
    setOpenedDialog,
    classroomIntegrationSessions,
    classroomIntegrationSessionsQuery,
    setShowDeleteDialog,
  } = useClassroomCalendarContext();

  if (classroomIntegrationSessionsQuery.isPending) {
    return <Loading className="h-[500px]" />;
  }

  return (
    <>
      <div className="space-y-6">
        <Calendar
          availableViews={['agenda', 'week', 'month']}
          view="week"
          events={
            (classroomIntegrationSessions?.map((session) => ({
              id: session.id,
              type: 'session',
              data: session,
              title: session.classroomIntegration?.subject?.name || '',
              startDate: session.startDate,
              endDate: session.endDate,
              color: 'green',
              description: session.description || '',
              user: session.teacher as any,
            })) as IEvent[]) || ([] as IEvent[])
          }
          addEventButtonText={t('classrooms.calendar.addNew')}
          onClickAddEvent={(time) => {
            setOpenedDialog('create');
            setCurrentRow({
              startDate: time.toLocaleString(),
              endDate: addMinutes(time, 30).toLocaleString(),
            } as any);
          }}
          onClickEditEvent={(eventId) => {
            setCurrentRow(
              classroomIntegrationSessions?.find(
                (session) => session.id === eventId
              ) as any
            );
            setOpenedDialog('edit');
          }}
          onClickRemoveEvent={(eventId) => {
            setCurrentRow(
              classroomIntegrationSessions?.find(
                (session) => session.id === eventId
              ) as any
            );
            setShowDeleteDialog(true);
          }}
          onClickEventCard={(eventId) => {
            setCurrentRow(
              classroomIntegrationSessions?.find(
                (session) => session.id === eventId
              ) as any
            );
            setOpenedDialog('view');
          }}
        />
      </div>

      <ClassroomCalendarDialogs />
    </>
  );
}

export function ClassroomCalendar() {
  return (
    <ClassroomCalendarProvider>
      <ClassroomCalendarContent />
    </ClassroomCalendarProvider>
  );
}
