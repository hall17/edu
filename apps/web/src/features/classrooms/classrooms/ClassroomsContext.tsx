import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters, useUsersQuery } from '@/hooks';
import { queryClient, Classroom, trpc } from '@/lib/trpc';

type ClassroomsDialogType = 'add' | 'edit' | 'delete' | 'view';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useDialogState<ClassroomsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Classroom | null>(null);
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/classrooms/'
  );

  const classroomsQuery = useQuery(
    trpc.classroom.findAll.queryOptions(filters)
  );

  const queryKey = trpc.classroom.findAll.queryKey(filters);

  function createClassroom(classroom: Classroom) {
    queryClient.setQueryData(queryKey, (data: typeof classroomsQuery.data) => {
      return {
        classrooms: [classroom, ...(data?.classrooms ?? [])],
        count: data?.count ? data.count + 1 : 1,
      };
    });
  }

  function updateClassroom(classroom: Classroom) {
    queryClient.setQueryData(queryKey, (data: typeof classroomsQuery.data) => {
      return {
        classrooms:
          data?.classrooms.map((c) =>
            c.id === classroom.id ? classroom : c
          ) ?? [],
        count: data?.count ?? 0,
      };
    });
  }

  function deleteClassroom(id: string) {
    queryClient.setQueryData(queryKey, (data: typeof classroomsQuery.data) => {
      return {
        classrooms: data?.classrooms.filter((c) => c.id !== id) ?? [],
        count: data?.count ? data.count - 1 : 0,
      };
    });
  }

  function setOpenedDialogFn(dialog: ClassroomsDialogType | null) {
    setOpenedDialog(dialog);

    if (!dialog) {
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
    classroomsQuery,
    queryKey,
    filters,
    setFilters,
    resetFilters,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  };
}

const ClassroomsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function ClassroomsProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <ClassroomsContext.Provider value={value}>
      {props.children}
    </ClassroomsContext.Provider>
  );
}

export function useClassroomsContext() {
  const classroomsContext = React.useContext(ClassroomsContext);

  if (!classroomsContext) {
    throw new Error('useClassrooms has to be used within <ClassroomsContext>');
  }

  return classroomsContext;
}
