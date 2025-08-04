import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { trpc } from '@/lib/trpc';

interface QuestionBankRootProviderProps {
  children: React.ReactNode;
}

function useProviderValue() {
  const questionsMetadataQuery = useQuery(
    trpc.question.findMetadata.queryOptions()
  );

  return {
    questionsMetadataQuery,
    questions: questionsMetadataQuery.data || [],
  };
}

const QuestionBankRootContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function QuestionBankRootProvider({
  children,
}: QuestionBankRootProviderProps) {
  const value = useProviderValue();

  return (
    <QuestionBankRootContext.Provider value={value}>
      {children}
    </QuestionBankRootContext.Provider>
  );
}

export function useQuestionBankRootContext() {
  const questionBankRootContext = React.useContext(QuestionBankRootContext);

  if (!questionBankRootContext) {
    throw new Error(
      'useQuestionBankRootContext has to be used within <QuestionBankRootContext>'
    );
  }

  return questionBankRootContext;
}
