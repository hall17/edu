import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters } from '@/hooks';
import { queryClient, ClassroomTemplate, trpc } from '@/lib/trpc';

type ClassroomTemplatesDialogType = 'add' | 'edit' | 'delete' | 'view';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useDialogState<ClassroomTemplatesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<ClassroomTemplate | null>(null);
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/classrooms/templates'
  );

  const templatesQuery = useQuery(
    trpc.classroomTemplate.findAll.queryOptions(filters)
  );

  const queryKey = trpc.classroomTemplate.findAll.queryKey(filters);

  function createTemplate(template: ClassroomTemplate) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return data;

      const newCount = data.pagination.count + 1;

      return {
        ...data,
        classroomTemplates: [template, ...(data?.classroomTemplates ?? [])],
        pagination: {
          ...data.pagination,
          count: newCount,
          totalPages: Math.ceil(newCount / data.pagination.size),
        },
      } satisfies typeof data;
    });
  }

  function updateTemplate(template: ClassroomTemplate) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return data;
      return {
        ...data,
        classroomTemplates:
          data?.classroomTemplates.map((t) =>
            t.id === template.id ? template : t
          ) ?? [],
      };
    });
  }

  function deleteTemplate(id: string) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return data;

      const newCount = data.pagination.count - 1;

      return {
        classroomTemplates:
          data?.classroomTemplates.filter((t) => t.id !== id) ?? [],
        pagination: {
          ...data?.pagination,
          count: newCount,
          totalPages: Math.ceil(newCount / data.pagination.size),
        },
      };
    });
  }

  function setOpenedDialogFn(dialog: ClassroomTemplatesDialogType | null) {
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
    templatesQuery,
    queryKey,
    filters,
    setFilters,
    resetFilters,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}

const ClassroomTemplatesContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function ClassroomTemplatesProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <ClassroomTemplatesContext.Provider value={value}>
      {props.children}
    </ClassroomTemplatesContext.Provider>
  );
}

export function useClassroomTemplatesContext() {
  const templatesContext = React.useContext(ClassroomTemplatesContext);

  if (!templatesContext) {
    throw new Error(
      'useClassroomTemplatesContext has to be used within <ClassroomTemplatesProvider>'
    );
  }

  return templatesContext;
}
