import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React from 'react';

import { trpc } from '@/lib/trpc';

function useProviderValue() {
  const { classroomId } = useParams({
    from: '/_authenticated/classrooms/$classroomId',
  });

  const classroomQuery = useQuery(
    trpc.classroom.findOne.queryOptions({
      id: classroomId,
    })
  );

  const classroom = classroomQuery.data;

  console.log('classroom context', classroom);

  return {
    classroom,
    classroomQuery,
  };
}

const ClassroomDetailsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function ClassroomDetailsProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <ClassroomDetailsContext.Provider value={value}>
      {props.children}
    </ClassroomDetailsContext.Provider>
  );
}

export function useClassroomDetailsContext() {
  const classroomDetailsContext = React.useContext(ClassroomDetailsContext);

  if (!classroomDetailsContext) {
    throw new Error(
      'useClassroomDetailsContext has to be used within <ClassroomDetailsContext>'
    );
  }

  return classroomDetailsContext;
}
