import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React from 'react';

import { useClassroomDetailsContext } from '../ClassroomDetailsContext';

import { trpc } from '@/lib/trpc';

function useProviderValue() {
  const { classroomId } = useParams({
    from: '/_authenticated/classrooms/$classroomId/attendance',
  });

  const { classroom } = useClassroomDetailsContext();

  // Get current month/year
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = React.useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = React.useState(
    currentDate.getFullYear()
  );

  // Get the first integration by default
  const firstIntegrationId = classroom?.integrations?.[0]?.id;
  const [selectedIntegrationId, setSelectedIntegrationId] = React.useState<
    string | undefined
  >(firstIntegrationId);

  // Update selected integration when classroom loads
  React.useEffect(() => {
    if (firstIntegrationId && !selectedIntegrationId) {
      setSelectedIntegrationId(firstIntegrationId);
    }
  }, [firstIntegrationId, selectedIntegrationId]);

  const filters = {
    all: true,
    classroomId,
  };

  // Fetch integration sessions (same as ClassroomSessionsContext)
  const classroomIntegrationSessionsQuery = useQuery(
    trpc.classroom.findAllIntegrationSessions.queryOptions(filters)
  );

  const classroomIntegrationSessions =
    classroomIntegrationSessionsQuery.data?.integrationSessions || [];

  // Filter sessions by selected integration, month, and year
  const filteredSessions = React.useMemo(() => {
    return classroomIntegrationSessions.filter((session) => {
      const sessionDate = new Date(session.startDate);
      const matchesIntegration = selectedIntegrationId
        ? session.classroomIntegrationId === selectedIntegrationId
        : true;
      const matchesMonth = sessionDate.getMonth() + 1 === selectedMonth;
      const matchesYear = sessionDate.getFullYear() === selectedYear;

      return matchesIntegration && matchesMonth && matchesYear;
    });
  }, [
    classroomIntegrationSessions,
    selectedIntegrationId,
    selectedMonth,
    selectedYear,
  ]);

  return {
    classroomId,
    classroom,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    selectedIntegrationId,
    setSelectedIntegrationId,
    classroomIntegrationSessionsQuery,
    classroomIntegrationSessions: filteredSessions,
  };
}

const ClassroomAttendanceContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function ClassroomAttendanceProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <ClassroomAttendanceContext.Provider value={value}>
      {props.children}
    </ClassroomAttendanceContext.Provider>
  );
}

export function useClassroomAttendanceContext() {
  const classroomAttendanceContext = React.useContext(
    ClassroomAttendanceContext
  );

  if (!classroomAttendanceContext) {
    throw new Error(
      'useClassroomAttendanceContext has to be used within <ClassroomAttendanceProvider>'
    );
  }

  return classroomAttendanceContext;
}
