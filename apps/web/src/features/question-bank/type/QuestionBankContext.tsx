import { QuestionType } from '@edusama/server';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters } from '@/hooks';
import { queryClient, Question, Subject, trpc } from '@/lib/trpc';

type QuestionBankDialogType = 'add' | 'edit' | 'delete' | 'view';

interface QuestionBankProviderProps {
  children: React.ReactNode;
  initialFilters?: { type?: string[] };
}

function useProviderValue(initialFilters?: { type?: string[] }) {
  const { type } = useParams({
    from: '/_authenticated/question-bank/type/$type',
  });
  const [openedDialog, setOpenedDialog] =
    useDialogState<QuestionBankDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Question | null>(null);

  const {
    filters: searchFilters,
    setFilters,
    resetFilters,
  } = useSearchFilters('/_authenticated/question-bank/type/$type');

  const filters: typeof searchFilters = {
    ...searchFilters,
    type: [type.toUpperCase() as QuestionType],
  };

  const questionsQuery = useQuery(trpc.question.findAll.queryOptions(filters));
  const questions = questionsQuery.data?.questions;
  type SubjectType = NonNullable<typeof questions>[number]['subject'];
  type CurriculumType = NonNullable<
    NonNullable<typeof questions>[number]['curriculum']
  >;

  // const subjects = questionsQuery.data?.questions.reduce((acc, q) => {
  //   if (acc.find((s) => s.id === q.subject.id)) {
  //     return acc;
  //   }
  //   return [...acc, q.subject] as SubjectType[];
  // }, [] as SubjectType[]);

  // const curriculums =
  //   questionsQuery.data?.questions.reduce((acc, q) => {
  //     if (!q.curriculum) return acc;
  //     if (acc.find((curriculum) => curriculum?.id === q.curriculum!.id)) {
  //       return acc;
  //     }
  //     return [...acc, q.curriculum] as CurriculumType[];
  //   }, [] as CurriculumType[]) ?? [];

  const queryKey = trpc.question.findAll.queryKey(filters);

  const subjectsQuery = useQuery(
    trpc.subject.findAll.queryOptions({
      all: true,
    })
  );

  function createQuestion(question: Question) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        questions: [question, ...(data?.questions ?? [])],
        count: data?.count ? data.count + 1 : 1,
      };
    });
  }

  function updateQuestion(question: Question) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        questions:
          data?.questions.map((q) => (q.id === question.id ? question : q)) ??
          [],
        count: data?.count ?? 0,
      };
    });
  }

  function deleteQuestion(id: string) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        questions: data?.questions.filter((q) => q.id !== id) ?? [],
        count: data?.count ? data.count - 1 : 0,
      };
    });
  }

  function setOpenedDialogFn(dialog: QuestionBankDialogType | null) {
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
    questionsQuery,
    subjectsQuery,
    queryKey,
    filters,
    setFilters,
    resetFilters,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    questions,
    // subjects,
    // curriculums,
  };
}

const QuestionBankContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function QuestionBankProvider({ children }: QuestionBankProviderProps) {
  const value = useProviderValue();

  return (
    <QuestionBankContext.Provider value={value}>
      {children}
    </QuestionBankContext.Provider>
  );
}

export function useQuestionBankContext() {
  const questionBankContext = React.useContext(QuestionBankContext);

  if (!questionBankContext) {
    throw new Error(
      'useQuestionBank has to be used within <QuestionBankContext>'
    );
  }

  return questionBankContext;
}
