import React, { useState } from 'react';

import {
  Curriculum,
  useSubjectDetailsContext,
} from '@/features/subjects/subject-details/SubjectDetailsContext';

import { useDialogState } from '@/hooks';
import { queryClient } from '@/lib/trpc';

type CurriculumsDialogType = 'add' | 'edit' | 'delete';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useDialogState<CurriculumsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Curriculum | null>(null);
  const { subjectQueryKey, subject } = useSubjectDetailsContext();

  const curriculums = subject?.curriculums ?? [];

  function createCurriculum(curriculum: Curriculum) {
    queryClient.setQueryData(subjectQueryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        curriculums: [...(data.curriculums ?? []), curriculum],
      };
    });
  }

  function updateCurriculum(curriculum: Curriculum) {
    queryClient.setQueryData(subjectQueryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        curriculums: data.curriculums.map((c) =>
          c.id === curriculum.id ? curriculum : c
        ),
      };
    });
  }

  function deleteCurriculum(id: string) {
    queryClient.setQueryData(subjectQueryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        curriculums: data.curriculums.filter((c) => c.id !== id),
      };
    });
  }

  function setOpenedDialogFn(dialog: CurriculumsDialogType | null) {
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
    subject,
    curriculums,
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
  const curriculumsContext = React.useContext(CurriculumsContext);

  if (!curriculumsContext) {
    throw new Error(
      'useCurriculumsContext has to be used within <CurriculumsContext>'
    );
  }

  return curriculumsContext;
}
