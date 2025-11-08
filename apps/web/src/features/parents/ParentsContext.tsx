import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters } from '@/hooks';
import {
  FindAllStudentsInput,
  FindAllUsersInput,
  Parent,
  queryClient,
  trpc,
} from '@/lib/trpc';

type ParentsDialogType =
  | 'invite'
  | 'add'
  | 'edit'
  | 'delete'
  | 'view'
  | 'suspend'
  | 'changePassword'
  | 'enrollStudents';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useDialogState<ParentsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Parent | null>(null);
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/parents/'
  );

  const [studentFilters, setStudentFilters] = useState<FindAllStudentsInput>({
    parentId: null,
  });

  const [parentId, setParentId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const parentsQuery = useQuery(trpc.parent.findAll.queryOptions(filters));

  const queryKey = trpc.parent.findAll.queryKey(filters);

  const studentsQuery = useQuery(
    trpc.student.findAll.queryOptions(studentFilters)
  );

  const searchStudentsQuery = useQuery(
    trpc.student.findAll.queryOptions({
      q: searchQuery,
    })
  );

  function createParent(parent: Parent) {
    queryClient.setQueryData(queryKey, (data: typeof parentsQuery.data) => {
      return {
        parents: [parent, ...(data?.parents ?? [])],
        count: data?.count ? data.count + 1 : 1,
      };
    });
  }

  function updateParent(parent: Parent) {
    queryClient.setQueryData(queryKey, (data: typeof parentsQuery.data) => {
      return {
        parents:
          data?.parents.map((p) => (p.id === parent.id ? parent : p)) ?? [],
        count: data?.count ?? 0,
      };
    });
  }

  function deleteParent(id: string) {
    queryClient.setQueryData(queryKey, (data: typeof parentsQuery.data) => {
      return {
        parents: data?.parents.filter((p) => p.id !== id) ?? [],
        count: data?.count ? data.count - 1 : 0,
      };
    });
  }

  function setOpenedDialogFn(dialog: ParentsDialogType | null) {
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
    parentsQuery,
    queryKey,
    filters,
    setFilters,
    resetFilters,
    createParent,
    updateParent,
    deleteParent,
    studentsQuery,
    studentFilters,
    setStudentFilters,
    parentId,
    setParentId,
    searchQuery,
    setSearchQuery,
    searchStudentsQuery,
  };
}

const ParentsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function ParentsProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <ParentsContext.Provider value={value}>
      {props.children}
    </ParentsContext.Provider>
  );
}

export function useParentsContext() {
  const parentsContext = React.useContext(ParentsContext);

  if (!parentsContext) {
    throw new Error('useParents has to be used within <ParentsContext>');
  }

  return parentsContext;
}
