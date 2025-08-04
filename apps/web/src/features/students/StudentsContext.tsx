import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters, useUsersQuery } from '@/hooks';
import { queryClient, Student, trpc } from '@/lib/trpc';

type StudentsDialogType =
  | 'invite'
  | 'add'
  | 'edit'
  | 'delete'
  | 'view'
  | 'suspend'
  | 'changePassword'
  | 'resendInvitation';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useDialogState<StudentsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Student | null>(null);
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/students/'
  );

  const studentsQuery = useQuery(trpc.student.findAll.queryOptions(filters));

  const queryKey = trpc.student.findAll.queryKey(filters);

  function createStudent(student: Student) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        students: [student, ...(data?.students ?? [])],
        count: data?.count ? data.count + 1 : 1,
      };
    });
  }

  function updateStudent(student: Student) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        students:
          data?.students.map((s) => (s.id === student.id ? student : s)) ?? [],
        count: data?.count ?? 0,
      };
    });
  }

  function updateStudentSignupStatus(id: string, status: Student['status']) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        students:
          data?.students.map((s) => (s.id === id ? { ...s, status } : s)) ?? [],
        count: data?.count ?? 0,
      };
    });
  }

  function deleteStudent(id: string) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        students: data?.students.filter((s) => s.id !== id) ?? [],
        count: data?.count ? data.count - 1 : 0,
      };
    });
  }

  function setOpenedDialogFn(dialog: StudentsDialogType | null) {
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
    studentsQuery,
    queryKey,
    filters,
    setFilters,
    resetFilters,
    createStudent,
    updateStudent,
    updateStudentSignupStatus,
    deleteStudent,
  };
}

const StudentsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function StudentsProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <StudentsContext.Provider value={value}>
      {props.children}
    </StudentsContext.Provider>
  );
}

export function useStudentsContext() {
  const studentsContext = React.useContext(StudentsContext);

  if (!studentsContext) {
    throw new Error('useStudents has to be used within <StudentsContext>');
  }

  return studentsContext;
}
