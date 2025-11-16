import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React, { useContext } from 'react';

import { Subject, trpc } from '@/lib/trpc';

export type Curriculum = Subject['curriculums'][number];
export type Unit = Curriculum['units'][number];
export type Lesson = Unit['lessons'][number];
export type LessonMaterial = Lesson['materials'][number];

function useProviderValue() {
  const { subjectId, curriculumId, unitId, lessonId } = useParams({
    strict: false,
  });

  const subjectQuery = useQuery(
    trpc.subject.findOne.queryOptions(
      { id: subjectId ?? '' },
      { enabled: !!subjectId }
    )
  );

  const subjectQueryKey = trpc.subject.findOne.queryKey({
    id: subjectId ?? '',
  });

  const curriculum = curriculumId
    ? subjectQuery.data?.curriculums.find(
        (curriculum) => curriculum.id === curriculumId
      )
    : undefined;

  const unit =
    curriculum && unitId
      ? curriculum?.units.find((unit) => unit.id === unitId)
      : undefined;

  const lesson =
    unit && lessonId
      ? unit?.lessons.find((lesson) => lesson.id === lessonId)
      : undefined;

  return {
    subjectQuery,
    subjectQueryKey,
    subject: subjectQuery.data,
    isLoading: subjectQuery.isLoading,
    subjectId,
    curriculum,
    unit,
    lesson,
  };
}

const SubjectDetailsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function SubjectDetailsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useProviderValue();

  return (
    <SubjectDetailsContext.Provider value={value}>
      {children}
    </SubjectDetailsContext.Provider>
  );
}

export function useSubjectDetailsContext() {
  const context = useContext(SubjectDetailsContext);

  if (!context) {
    throw new Error(
      'useSubjectDetailsContext must be used within a SubjectDetailsProvider'
    );
  }

  return context;
}
