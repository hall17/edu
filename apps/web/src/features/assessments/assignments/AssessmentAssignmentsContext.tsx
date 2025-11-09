import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { useSearchFilters } from '@/hooks';
import { trpc } from '@/lib/trpc';

type ClassroomIntegrationAssessment = any;

function useProviderValue() {
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/_assessments/assessments/assigned'
  );

  const assignmentsQuery = useQuery(
    trpc.assessment.findAllClassroomIntegrationAssessments.queryOptions(filters)
  );

  const queryKey =
    trpc.assessment.findAllClassroomIntegrationAssessments.queryKey(filters);

  return {
    assignmentsQuery,
    queryKey,
    filters,
    setFilters,
    resetFilters,
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
