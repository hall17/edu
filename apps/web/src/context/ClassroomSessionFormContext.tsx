import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

import {
  classroomSessionFormInitialValues,
  classroomSessionFormSchema,
  type ClassroomSessionFormData,
} from '@/lib/schemas/classroomSessionFormSchema';
import { ClassroomFromFindOne, ClassroomIntegrationSession } from '@/lib/trpc';

interface ProviderProps {
  defaultValues?: ClassroomSessionFormData;
  classroom?: ClassroomFromFindOne;
  session?: ClassroomIntegrationSession;
}

function useProviderValue(props: ProviderProps) {
  const form = useForm<ClassroomSessionFormData>({
    resolver: zodResolver(classroomSessionFormSchema),
    defaultValues: props.defaultValues ?? classroomSessionFormInitialValues,
    mode: 'onSubmit',
  });

  function resetFormToInitialValues() {
    form.reset(props.defaultValues ?? classroomSessionFormInitialValues);
  }

  return {
    ...props,
    form,
    resetFormToInitialValues,
  };
}

const ClassroomSessionFormContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function ClassroomSessionFormProvider(
  props: ProviderProps & { children: React.ReactNode }
) {
  const { children, ...rest } = props;
  const value = useProviderValue(rest);

  return (
    <ClassroomSessionFormContext.Provider value={value}>
      {children}
    </ClassroomSessionFormContext.Provider>
  );
}

export function useClassroomSessionForm() {
  const context = React.useContext(ClassroomSessionFormContext);

  if (!context) {
    throw new Error(
      'useClassroomSessionForm must be used within <ClassroomSessionFormProvider>'
    );
  }

  return context;
}
