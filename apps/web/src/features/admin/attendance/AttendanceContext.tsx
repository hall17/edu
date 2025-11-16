import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useSearchFilters } from '@/hooks';
import { trpc } from '@/lib/trpc';
import { ClassroomIntegration } from '@/lib/trpc';

function useProviderValue() {
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/attendance/'
  );

  const [openedDialog, setOpenedDialog] = useState<string | null>(null);
  const [currentRow, setCurrentRow] = useState<ClassroomIntegration | null>(
    null
  );

  const attendanceQuery = useQuery(
    trpc.classroom.findAllClassroomIntegrations.queryOptions(filters)
  );

  return {
    attendanceQuery,
    filters,
    setFilters,
    resetFilters,
    openedDialog,
    setOpenedDialog,
    currentRow,
    setCurrentRow,
  };
}

const AttendanceContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function AttendanceProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <AttendanceContext.Provider value={value}>
      {props.children}
    </AttendanceContext.Provider>
  );
}

export function useAttendanceContext() {
  const attendanceContext = React.useContext(AttendanceContext);

  if (!attendanceContext) {
    throw new Error('useAttendance has to be used within <AttendanceContext>');
  }

  return attendanceContext;
}
