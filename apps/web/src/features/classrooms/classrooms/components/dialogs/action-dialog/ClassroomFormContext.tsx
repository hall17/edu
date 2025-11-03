import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  basicSchema,
  ClassroomFormData,
  classroomFormInitialValues,
  classroomFormSchema,
  integrationsSchema,
  modulesSchema,
} from './classroomFormSchema';

import { trpc } from '@/lib/trpc';

function useProviderValue() {
  const { t } = useTranslation();

  const subjectsQuery = useQuery(
    trpc.subject.findAll.queryOptions({ all: true })
  );

  const schemasById = useMemo(() => {
    return {
      schema: classroomFormSchema,
      basic: basicSchema,
      modules: modulesSchema,
      integrations: integrationsSchema,
    };
  }, [t]);

  const form = useForm<ClassroomFormData>({
    resolver: zodResolver(classroomFormSchema),
    mode: 'onSubmit',
  });

  const {
    fields: integrationFields,
    append: appendIntegration,
    remove: removeIntegration,
    update: updateIntegration,
  } = useFieldArray({
    control: form.control,
    name: 'integrations',
  });

  const watchedIntegrations = form.watch('integrations');

  function resetFormToInitialValues() {
    form.reset(classroomFormInitialValues);
  }

  return {
    form,
    integrationFields,
    appendIntegration,
    removeIntegration,
    updateIntegration,
    schemasById,
    resetFormToInitialValues,
    watchedIntegrations,
    subjects: subjectsQuery.data?.subjects ?? [],
    subjectsQuery,
  };
}

const ClassroomFormContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function ClassroomFormProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <ClassroomFormContext.Provider value={value}>
      {props.children}
    </ClassroomFormContext.Provider>
  );
}

export function useClassroomForm() {
  const classroomFormContext = React.useContext(ClassroomFormContext);

  if (!classroomFormContext) {
    throw new Error(
      'useClassroomForm has to be used within <ClassroomFormContext>'
    );
  }

  return classroomFormContext;
}
