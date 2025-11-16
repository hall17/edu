import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useClassroomForm } from '../../ClassroomFormContext';

import { CalendarEventDialog } from './CalendarEventDialog';

import { Calendar } from '@/components/calendar/calendar';
import { IEvent } from '@/components/calendar/interfaces';
import { ClassroomIntegrationSession } from '@/lib/trpc';

export function CalendarStep() {
  const { t } = useTranslation();
  const { watchedIntegrations, subjects } = useClassroomForm();
  const [selectedEvent, setSelectedEvent] =
    useState<ClassroomIntegrationSession | null>(null);

  const events = watchedIntegrations?.reduce(
    (acc, integration) => {
      const subject = subjects.find(
        (subject) => subject.id === integration.subjectId
      );
      const curriculum = subject?.curriculums.find(
        (curriculum) => curriculum.id === integration.curriculumId
      );

      const eventData: IEvent[] = integration.sessions.map((sessionData) => {
        const lessons = (
          curriculum?.units.flatMap((unit) => unit.lessons) ?? []
        ).filter((lesson) => sessionData.lessonIds?.includes(lesson.id));
        const teacher = subject?.teachers.find(
          (teacher) => teacher.teacher.id === sessionData.teacherId
        );

        const session = {
          ...sessionData,
          teacher: teacher?.teacher ?? null,
          lessons:
            lessons?.map((lesson) => ({
              lesson,
              lessonId: lesson.id,
            })) ?? [],
        } as unknown as ClassroomIntegrationSession;

        return {
          id: session.id ?? crypto.randomUUID(),
          type: 'session',
          data: session,
          title: subject?.name || '',
          description: curriculum?.name || '',
          startDate: session.startDate,
          endDate: session.endDate,
          color: 'green',
        };
      });
      return [...acc, ...eventData];
    },

    [] as IEvent[]
  );

  return (
    <div>
      <Calendar
        availableViews={['agenda', 'week', 'month']}
        view="week"
        events={events}
        addEventButtonText={t('classrooms.calendar.addNew')}
        allowAddEvent={false}
        onClickEventCard={(eventId) => {
          const event = events.find((event) => event.id === eventId);

          if (event) {
            setSelectedEvent(event.data as ClassroomIntegrationSession);
          }
        }}
      />
      {selectedEvent && (
        <CalendarEventDialog
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
