import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters, useUsersQuery } from '@/hooks';
import { queryClient, Assessment, trpc } from '@/lib/trpc';

type AssessmentsDialogType = 'add' | 'edit' | 'delete' | 'view' | 'suspend';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useDialogState<AssessmentsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Assessment | null>(null);
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/assessments/'
  );

  const assessmentsQuery = useQuery(
    trpc.assessment.findAll.queryOptions(filters)
  );
  const queryKey = trpc.assessment.findAll.queryKey(filters);

  function createAssessment(assessment: Assessment) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        assessments: [assessment, ...(data?.assessments ?? [])],
        pagination: {
          ...data?.pagination,
          count: data?.pagination?.count ? data.pagination.count + 1 : 1,
        },
      };
    });
  }

  function updateAssessment(assessment: Assessment) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        assessments:
          data?.assessments.map((s) =>
            s.id === assessment.id ? assessment : s
          ) ?? [],
      };
    });
  }

  function deleteAssessment(id: string) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        assessments: data?.assessments.filter((s) => s.id !== id) ?? [],
        pagination: {
          ...data?.pagination,
          count: data?.pagination?.count ? data.pagination.count - 1 : 0,
        },
      };
    });
  }

  function setOpenedDialogFn(dialog: AssessmentsDialogType | null) {
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
    assessmentsQuery,
    queryKey,
    filters,
    setFilters,
    resetFilters,
    createAssessment,
    updateAssessment,
    deleteAssessment,
  };
}

const AssessmentsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function AssessmentsProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <AssessmentsContext.Provider value={value}>
      {props.children}
    </AssessmentsContext.Provider>
  );
}

export function useAssessmentsContext() {
  const assessmentsContext = React.useContext(AssessmentsContext);

  if (!assessmentsContext) {
    throw new Error(
      'useAssessments has to be used within <AssessmentsContext>'
    );
  }

  return assessmentsContext;
}
