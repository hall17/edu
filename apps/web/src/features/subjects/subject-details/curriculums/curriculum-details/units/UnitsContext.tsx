import React, { useState } from 'react';

import {
  Unit,
  useSubjectDetailsContext,
} from '@/features/subjects/subject-details/SubjectDetailsContext';

import { useDialogState } from '@/hooks';
import { queryClient } from '@/lib/trpc';

type UnitsDialogType = 'add' | 'edit' | 'delete';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] = useDialogState<UnitsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Unit | null>(null);
  const { subjectQueryKey, curriculum } = useSubjectDetailsContext();

  const units = curriculum?.units ?? [];

  function createUnit(unit: Unit) {
    queryClient.setQueryData(subjectQueryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        curriculums: data.curriculums.map((c) =>
          c.id === curriculum?.id
            ? { ...c, units: [...(c.units ?? []), unit] }
            : c
        ),
      };
    });
  }

  function updateUnit(unit: Unit) {
    queryClient.setQueryData(subjectQueryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        curriculums: data.curriculums.map((c) =>
          c.id === curriculum?.id
            ? {
                ...c,
                units: c.units.map((u) => (u.id === unit.id ? unit : u)),
              }
            : c
        ),
      };
    });
  }

  function deleteUnit(id: string) {
    queryClient.setQueryData(subjectQueryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        curriculums: data.curriculums.map((c) =>
          c.id === curriculum?.id
            ? { ...c, units: c.units.filter((u) => u.id !== id) }
            : c
        ),
      };
    });
  }

  function setOpenedDialogFn(dialog: UnitsDialogType | null) {
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
    curriculum,
    units,
    createUnit,
    updateUnit,
    deleteUnit,
  };
}

const UnitsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function UnitsProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <UnitsContext.Provider value={value}>
      {props.children}
    </UnitsContext.Provider>
  );
}

export function useUnitsContext() {
  const unitsContext = React.useContext(UnitsContext);

  if (!unitsContext) {
    throw new Error('useUnitsContext has to be used within <UnitsContext>');
  }

  return unitsContext;
}
