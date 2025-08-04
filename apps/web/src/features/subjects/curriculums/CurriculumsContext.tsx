import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters } from '@/hooks';
import { queryClient, Curriculum, trpc } from '@/lib/trpc';

type CurriculumDialogType = 'add' | 'view' | 'edit' | 'delete' | 'suspend';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useDialogState<CurriculumDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Curriculum | null>(null);

  const { filters, setFilters } = useSearchFilters(
    '/_authenticated/subjects/curriculums'
  );

  const curriculumsQuery = useQuery(
    trpc.curriculum.findAll.queryOptions(filters)
  );

  const curriculumsQueryKey = trpc.curriculum.findAll.queryKey(filters);

  function createCurriculum(curriculum: Curriculum) {
    queryClient.setQueryData(
      curriculumsQueryKey,
      (data: typeof curriculumsQuery.data) => {
        return {
          curriculums: [curriculum, ...(data?.curriculums ?? [])],
          count: data?.count ? data.count + 1 : 1,
        };
      }
    );
  }

  function updateCurriculum(curriculum: Curriculum) {
    queryClient.setQueryData(
      curriculumsQueryKey,
      (data: typeof curriculumsQuery.data) => {
        return {
          curriculums:
            data?.curriculums.map((c) =>
              c.id === curriculum.id ? curriculum : c
            ) ?? [],
          count: data?.count ?? 0,
        };
      }
    );
  }

  function deleteCurriculum(id: string) {
    queryClient.setQueryData(
      curriculumsQueryKey,
      (data: typeof curriculumsQuery.data) => {
        return {
          curriculums: data?.curriculums.filter((c) => c.id !== id) ?? [],
          count: data?.count ? data.count - 1 : 0,
        };
      }
    );
  }

  function setOpenedDialogFn(dialog: CurriculumDialogType | null) {
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
    curriculumsQuery,
    filters,
    setFilters,
    createCurriculum,
    updateCurriculum,
    deleteCurriculum,
  };
}

const CurriculumsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function CurriculumsProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <CurriculumsContext.Provider value={value}>
      {props.children}
    </CurriculumsContext.Provider>
  );
}

export function useCurriculumsContext() {
  const context = React.useContext(CurriculumsContext);

  if (!context) {
    throw new Error(
      'useCurriculumContext has to be used within <CurriculumsProvider>'
    );
  }

  return context;
}
