import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters } from '@/hooks';
import { ClassroomIntegrationAssessment, queryClient, trpc } from '@/lib/trpc';

type AssessmentAssignmentsDialogType = 'view' | 'edit' | 'delete';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useDialogState<AssessmentAssignmentsDialogType>(null);
  const [currentRow, setCurrentRow] =
    useState<ClassroomIntegrationAssessment | null>(null);
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/_assessments/assessments/assigned'
  );

  const assignmentsQuery = useQuery(
    trpc.assessment.findAllClassroomIntegrationAssessments.queryOptions(filters)
  );

  const queryKey =
    trpc.assessment.findAllClassroomIntegrationAssessments.queryKey(filters);

  function updateAssignment(assignment: ClassroomIntegrationAssessment) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        data:
          data.data.map((a) => (a.id === assignment.id ? assignment : a)) ?? [],
      };
    });
  }

  function updateAssignmentStatus(
    id: string,
    status: ClassroomIntegrationAssessment['status']
  ) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        data: data.data.map((a) => (a.id === id ? { ...a, status } : a)) ?? [],
      };
    });
  }

  function deleteAssignment(id: string) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        data: data.data.filter((a) => a.id !== id) ?? [],
        pagination: {
          ...data.pagination,
          total: data.pagination?.total ? data.pagination.total - 1 : 0,
        },
      };
    });
  }

  function setOpenedDialogFn(dialog: AssessmentAssignmentsDialogType | null) {
    setOpenedDialog(dialog);

    if (!dialog) {
      setTimeout(() => {
        setCurrentRow(null);
      }, 500);
    }
  }

  return {
    assignmentsQuery,
    queryKey,
    filters,
    setFilters,
    resetFilters,
    openedDialog,
    setOpenedDialog: setOpenedDialogFn,
    currentRow: currentRow!,
    setCurrentRow,
    updateAssignment,
    updateAssignmentStatus,
    deleteAssignment,
  };
}

const AssessmentAssignmentsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function AssessmentAssignmentsProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <AssessmentAssignmentsContext.Provider value={value}>
      {props.children}
    </AssessmentAssignmentsContext.Provider>
  );
}

export function useAssessmentAssignmentsContext() {
  const assignmentsContext = React.useContext(AssessmentAssignmentsContext);

  if (!assignmentsContext) {
    throw new Error(
      'useAssessmentAssignmentsContext has to be used within <AssessmentAssignmentsProvider>'
    );
  }

  return assignmentsContext;
}
