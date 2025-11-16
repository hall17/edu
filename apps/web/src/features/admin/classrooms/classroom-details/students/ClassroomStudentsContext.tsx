import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters } from '@/hooks';
import {
  queryClient,
  ClassroomStudent,
  trpc,
  ClassroomStudentsFindAllInput,
} from '@/lib/trpc';

type ClassroomStudentsDialogType =
  | 'enrollment'
  | 'delete'
  | 'view'
  | 'enrollmentStatus';

function useClassroomStudentsProviderValue() {
  const { classroomId } = useParams({
    from: '/_authenticated/classrooms/$classroomId/students',
  });
  const {
    filters: searchFilters,
    setFilters,
    resetFilters,
  } = useSearchFilters('/_authenticated/classrooms/$classroomId/students');
  const [openedDialog, setOpenedDialog] =
    useDialogState<ClassroomStudentsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<ClassroomStudent | null>(null);
  // Search functionality for enrollment
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filters: ClassroomStudentsFindAllInput = {
    ...searchFilters,
    classroomId,
  };

  const studentsQuery = useQuery(
    trpc.classroom.findAllStudents.queryOptions(filters)
  );

  const queryKey = trpc.classroom.findAllStudents.queryKey(filters);

  // Search students for enrollment
  const searchStudentsQuery = useQuery(
    trpc.student.findAll.queryOptions({
      q: searchQuery,
    })
  );

  function enrollStudent(studentId: string) {
    queryClient.invalidateQueries({
      queryKey,
    });
  }

  function unenrollStudent(id: string) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;

      return {
        ...data,
        students: data?.students.filter((s) => s.student.id !== id) ?? [],
        pagination: {
          ...data?.pagination,
          count: data?.pagination.count ? data.pagination.count - 1 : 0,
        },
      };
    });
  }

  function setOpenedDialogFn(dialog: ClassroomStudentsDialogType | null) {
    setOpenedDialog(dialog);

    if (!dialog) {
      setTimeout(() => {
        setCurrentRow(null);
      }, 500);
    }
  }

  return {
    classroomId,
    openedDialog,
    setOpenedDialog: setOpenedDialogFn,
    currentRow: currentRow!,
    setCurrentRow,
    studentsQuery,
    queryKey,
    filters,
    setFilters,
    resetFilters,
    searchOpen,
    setSearchOpen,
    searchQuery,
    setSearchQuery,
    searchStudentsQuery,
    enrollStudent,
    unenrollStudent,
  };
}

const ClassroomStudentsContext = React.createContext<ReturnType<
  typeof useClassroomStudentsProviderValue
> | null>(null);

export function ClassroomStudentsProvider(props: React.PropsWithChildren) {
  const value = useClassroomStudentsProviderValue();

  return (
    <ClassroomStudentsContext.Provider value={value}>
      {props.children}
    </ClassroomStudentsContext.Provider>
  );
}

export function useClassroomStudentsContext() {
  const classroomStudentsContext = React.useContext(ClassroomStudentsContext);

  if (!classroomStudentsContext) {
    throw new Error(
      'useClassroomStudentsContext has to be used within <ClassroomStudentsProvider>'
    );
  }

  return classroomStudentsContext;
}
