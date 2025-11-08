import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React, { useState } from 'react';

import { useSearchFilters } from '@/hooks';
import { ClassroomIntegrationSession, queryClient, trpc } from '@/lib/trpc';

type ClassroomCalendarDialogType = 'view' | 'edit' | 'create';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useState<ClassroomCalendarDialogType | null>(null);
  const [currentRow, setCurrentRow] =
    useState<ClassroomIntegrationSession | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const {
    filters: searchFilters,
    setFilters,
    resetFilters,
  } = useSearchFilters('/_authenticated/classrooms/$classroomId/calendar');

  const { classroomId } = useParams({
    from: '/_authenticated/classrooms/$classroomId/calendar',
  });

  const filters = {
    // ...searchFilters,
    all: true,
    classroomId,
  };

  const classroomIntegrationSessionsQuery = useQuery(
    trpc.classroom.findAllIntegrationSessions.queryOptions(filters)
  );
  const queryKey = trpc.classroom.findAllIntegrationSessions.queryKey(filters);

  const classroomIntegrationSessions =
    classroomIntegrationSessionsQuery.data?.integrationSessions;
  const pagination = classroomIntegrationSessionsQuery.data?.pagination;

  function deleteClassroomIntegrationSession(id: string) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;

      return {
        integrationSessions:
          data?.integrationSessions.filter((s) => s.id !== id) ?? [],
        pagination: {
          ...data.pagination,
          count: data.pagination.count - 1,
        },
      };
    });
  }

  function setOpenedDialogFn(dialog: ClassroomCalendarDialogType | null) {
    setOpenedDialog(dialog);

    if (!dialog) {
      setShowDeleteDialog(false);
      setTimeout(() => {
        setCurrentRow(null);
      }, 500);
    }
  }

  return {
    openedDialog,
    setOpenedDialog: setOpenedDialogFn,
    currentRow: currentRow!,
    setCurrentRow,
    classroomIntegrationSessionsQuery,
    searchFilters,
    setFilters,
    resetFilters,
    classroomIntegrationSessions,
    pagination,
    deleteClassroomIntegrationSession,
    showDeleteDialog,
    setShowDeleteDialog,
  };
}

const ClassroomCalendarContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function ClassroomCalendarProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <ClassroomCalendarContext.Provider value={value}>
      {props.children}
    </ClassroomCalendarContext.Provider>
  );
}

export function useClassroomCalendarContext() {
  const classroomCalendarContext = React.useContext(ClassroomCalendarContext);

  if (!classroomCalendarContext) {
    throw new Error(
      'useClassroomCalendarContext has to be used within <ClassroomCalendarContext>'
    );
  }

  return classroomCalendarContext;
}
