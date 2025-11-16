import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters } from '@/hooks';
import { queryClient, trpc, User } from '@/lib/trpc';

type TeachersDialogType =
  | 'invite'
  | 'add'
  | 'edit'
  | 'delete'
  | 'view'
  | 'suspend'
  | 'resetPassword';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useDialogState<TeachersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<User | null>(null);
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/teachers/'
  );

  const filterWithTeacherRole: typeof filters = {
    roleCodes: ['teacher'],
    ...filters,
  };

  const teachersQuery = useQuery(
    trpc.user.findAll.queryOptions(filterWithTeacherRole)
  );

  const queryKey = trpc.user.findAll.queryKey(filterWithTeacherRole);

  function createTeacher(teacher: User) {
    queryClient.setQueryData(queryKey, (data: typeof teachersQuery.data) => {
      return {
        users: [teacher, ...(data?.users ?? [])],
        count: data?.count ? data.count + 1 : 1,
      };
    });
  }

  function updateTeacher(teacher: User) {
    queryClient.setQueryData(queryKey, (data: typeof teachersQuery.data) => {
      return {
        users:
          data?.users.map((t) => (t.id === teacher.id ? teacher : t)) ?? [],
        count: data?.count ?? 0,
      };
    });
  }

  function deleteTeacher(id: string) {
    queryClient.setQueryData(queryKey, (data: typeof teachersQuery.data) => {
      return {
        users: data?.users.filter((t) => t.id !== id) ?? [],
        count: data?.count ? data.count - 1 : 0,
      };
    });
  }

  function setOpenedDialogFn(dialog: TeachersDialogType | null) {
    setOpenedDialog(dialog);

    if (!dialog) {
      setTimeout(() => {
        setCurrentRow(null);
      }, 500);
    }
  }

  return {
    openedDialog,
    setOpenedDialog,
    currentRow: currentRow!,
    setCurrentRow,
    teachersQuery,
    queryKey,
    filters,
    setFilters,
    resetFilters,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
}

const TeachersContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function TeachersProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <TeachersContext.Provider value={value}>
      {props.children}
    </TeachersContext.Provider>
  );
}

export function useTeachersContext() {
  const teachersContext = React.useContext(TeachersContext);

  if (!teachersContext) {
    throw new Error('useTeachers has to be used within <TeachersContext>');
  }

  return teachersContext;
}
