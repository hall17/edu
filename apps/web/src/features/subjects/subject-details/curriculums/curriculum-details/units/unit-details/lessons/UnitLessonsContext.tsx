import React, { useState } from 'react';

import {
  Lesson,
  useSubjectDetailsContext,
} from '@/features/subjects/subject-details/SubjectDetailsContext';

import { useDialogState } from '@/hooks';
import { queryClient } from '@/lib/trpc';

type LessonsDialogType = 'add' | 'edit' | 'delete' | 'add-material';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useDialogState<LessonsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Lesson | null>(null);
  const { subjectQueryKey, unit, curriculum } = useSubjectDetailsContext();

  const lessons = unit?.lessons ?? [];

  function createLesson(lesson: Lesson) {
    queryClient.setQueryData(subjectQueryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        curriculums:
          data?.curriculums.map((c) =>
            c.id === curriculum?.id
              ? {
                  ...c,
                  units: c.units.map((u) =>
                    u.id === unit?.id
                      ? { ...u, lessons: [...(u.lessons ?? []), lesson] }
                      : u
                  ),
                }
              : c
          ) ?? [],
      };
    });
  }

  function updateLesson(lesson: Lesson) {
    queryClient.setQueryData(subjectQueryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        curriculums:
          data?.curriculums.map((c) =>
            c.id === curriculum?.id
              ? {
                  ...c,
                  units: c.units.map((u) =>
                    u.id === unit?.id
                      ? {
                          ...u,
                          lessons: u.lessons.map((l) =>
                            l.id === lesson.id ? lesson : l
                          ),
                        }
                      : u
                  ),
                }
              : c
          ) ?? [],
      };
    });
  }

  function deleteLesson(id: string) {
    queryClient.setQueryData(subjectQueryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        curriculums:
          data?.curriculums.map((c) =>
            c.id === curriculum?.id
              ? {
                  ...c,
                  units: c.units.map((u) =>
                    u.id === unit?.id
                      ? { ...u, lessons: u.lessons.filter((l) => l.id !== id) }
                      : u
                  ),
                }
              : c
          ) ?? [],
      };
    });
  }

  function setOpenedDialogFn(dialog: LessonsDialogType | null) {
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
    unit,
    lessons,
    createLesson,
    updateLesson,
    deleteLesson,
  };
}

const UnitLessonsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function UnitLessonsProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <UnitLessonsContext.Provider value={value}>
      {props.children}
    </UnitLessonsContext.Provider>
  );
}

export function useUnitLessonsContext() {
  const lessonsContext = React.useContext(UnitLessonsContext);

  if (!lessonsContext) {
    throw new Error(
      'useUnitLessonsContext has to be used within <UnitLessonsContext>'
    );
  }

  return lessonsContext;
}
