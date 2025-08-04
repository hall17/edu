import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters } from '@/hooks';
import { queryClient, Subject, trpc } from '@/lib/trpc';

type SubjectsDialogType =
  | 'add'
  | 'invite'
  | 'edit'
  | 'delete'
  | 'view'
  | 'suspend';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useDialogState<SubjectsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Subject | null>(null);

  const { filters, setFilters } = useSearchFilters('/_authenticated/subjects/');

  const subjectsQuery = useQuery(trpc.subject.findAll.queryOptions(filters));

  const subjectsQueryKey = trpc.subject.findAll.queryKey(filters);

  function createSubject(subject: Subject) {
    queryClient.setQueryData(
      subjectsQueryKey,
      (data: typeof subjectsQuery.data) => {
        return {
          subjects: [subject, ...(data?.subjects ?? [])],
          count: data?.count ? data.count + 1 : 1,
        };
      }
    );
  }

  function updateSubject(subject: Subject) {
    queryClient.setQueryData(
      subjectsQueryKey,
      (data: typeof subjectsQuery.data) => {
        return {
          subjects:
            data?.subjects.map((s) => (s.id === subject.id ? subject : s)) ??
            [],
          count: data?.count ?? 0,
        };
      }
    );
  }

  function deleteSubject(id: string) {
    queryClient.setQueryData(
      subjectsQueryKey,
      (data: typeof subjectsQuery.data) => {
        return {
          subjects: data?.subjects.filter((s) => s.id !== id) ?? [],
          count: data?.count ? data.count - 1 : 0,
        };
      }
    );
  }

  function suspendSubject(id: string, status: Subject['status']) {
    queryClient.setQueryData(
      subjectsQueryKey,
      (data: typeof subjectsQuery.data) => {
        return {
          subjects:
            data?.subjects.map((s) => (s.id === id ? { ...s, status } : s)) ??
            [],
          count: data?.count ?? 0,
        };
      }
    );
  }

  function setOpenedDialogFn(dialog: SubjectsDialogType | null) {
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
    subjectsQuery,
    filters,
    setFilters,
    createSubject,
    updateSubject,
    deleteSubject,
    suspendSubject,
  };
}

const SubjectsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function SubjectsProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <SubjectsContext.Provider value={value}>
      {props.children}
    </SubjectsContext.Provider>
  );
}

export function useSubjectsContext() {
  const context = React.useContext(SubjectsContext);

  if (!context) {
    throw new Error(
      'useSubjectsContext has to be used within <SubjectsProvider>'
    );
  }

  return context;
}
