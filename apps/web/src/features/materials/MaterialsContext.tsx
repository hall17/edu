import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters } from '@/hooks';
import { queryClient, Curriculum, Subject, trpc } from '@/lib/trpc';

type MaterialsDialogType =
  | 'add-curriculum'
  | 'edit-curriculum'
  | 'delete-curriculum'
  | 'view-curriculum'
  | 'add-subject'
  | 'manage-subjects';

function useProviderValue() {
  const [open, setOpen] = useDialogState<MaterialsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Curriculum | null>(null);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/materials/'
  );

  const curriculumsQuery = useQuery(
    trpc.curriculum.findAll.queryOptions(filters)
  );

  const subjectsQuery = useQuery(
    trpc.subject.findAll.queryOptions({ all: true })
  );

  const queryKey = trpc.curriculum.findAll.queryKey(filters);
  const subjectsQueryKey = trpc.subject.findAll.queryKey({ all: true });

  function createCurriculum(curriculum: Curriculum) {
    queryClient.setQueryData(queryKey, (data: typeof curriculumsQuery.data) => {
      return {
        curriculums: [curriculum, ...(data?.curriculums ?? [])],
        count: data?.count ? data.count + 1 : 1,
      };
    });
  }

  function updateCurriculum(curriculum: Curriculum) {
    queryClient.setQueryData(queryKey, (data: typeof curriculumsQuery.data) => {
      return {
        curriculums:
          data?.curriculums.map((c) =>
            c.id === curriculum.id ? curriculum : c
          ) ?? [],
        count: data?.count ?? 0,
      };
    });
  }

  function deleteCurriculum(id: string) {
    queryClient.setQueryData(queryKey, (data: typeof curriculumsQuery.data) => {
      return {
        curriculums: data?.curriculums.filter((c) => c.id !== id) ?? [],
        count: data?.count ? data.count - 1 : 0,
      };
    });
  }

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

  return {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    currentSubject,
    setCurrentSubject,
    curriculumsQuery,
    subjectsQuery,
    queryKey,
    subjectsQueryKey,
    filters,
    setFilters,
    resetFilters,
    createCurriculum,
    updateCurriculum,
    deleteCurriculum,
    createSubject,
    updateSubject,
    deleteSubject,
  };
}

const MaterialsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function MaterialsProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <MaterialsContext.Provider value={value}>
      {props.children}
    </MaterialsContext.Provider>
  );
}

export function useMaterialsContext() {
  const materialsContext = React.useContext(MaterialsContext);

  if (!materialsContext) {
    throw new Error('useMaterials has to be used within <MaterialsContext>');
  }

  return materialsContext;
}
