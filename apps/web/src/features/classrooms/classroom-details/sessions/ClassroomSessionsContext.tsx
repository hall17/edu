import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React, { useState } from 'react';

import { useSearchFilters } from '@/hooks';
import { ClassroomIntegrationSession, queryClient, trpc } from '@/lib/trpc';

type ClassroomSessionsDialogType = 'view' | 'edit' | 'create';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useState<ClassroomSessionsDialogType | null>(null);
  const [currentRow, setCurrentRow] =
    useState<ClassroomIntegrationSession | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const {
    filters: searchFilters,
    setFilters,
    resetFilters,
  } = useSearchFilters('/_authenticated/classrooms/$classroomId/sessions');

  const { classroomId } = useParams({
    from: '/_authenticated/classrooms/$classroomId/sessions',
  });

  const filters = {
    ...searchFilters,
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

  function setOpenedDialogFn(dialog: ClassroomSessionsDialogType | null) {
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

const ClassroomSessionsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function ClassroomSessionsProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <ClassroomSessionsContext.Provider value={value}>
      {props.children}
    </ClassroomSessionsContext.Provider>
  );
}

export function useClassroomSessionsContext() {
  const classroomSessionsContext = React.useContext(ClassroomSessionsContext);

  if (!classroomSessionsContext) {
    throw new Error(
      'useClassroomSessionsContext has to be used within <ClassroomSessionsContext>'
    );
  }

  return classroomSessionsContext;
}
