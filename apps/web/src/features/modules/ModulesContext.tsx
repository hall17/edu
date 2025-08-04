import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

import { useSearchFilters } from '@/hooks';
import { BranchOnModule, trpc } from '@/lib/trpc';

function useProviderValue() {
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/modules/'
  );
  const queryClient = useQueryClient();

  const filter: typeof filters = { all: true, branchModules: true };
  const modulesQuery = useQuery(trpc.module.findAll.queryOptions(filter));
  const queryKey = trpc.module.findAll.queryKey(filter);

  function addBranchOnModule(branchOnModule: BranchOnModule) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;

      return {
        ...data,
        modules: data?.modules.map((m) =>
          m.id === branchOnModule.moduleId
            ? { ...m, branches: [branchOnModule] }
            : m
        ),
      };
    });
  }

  function updateBranchOnModule(branchOnModule: BranchOnModule) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return undefined;
      return {
        ...data,
        modules: data?.modules.map((m) =>
          m.id === branchOnModule.moduleId
            ? { ...m, branches: [branchOnModule] }
            : m
        ),
      };
    });
  }

  return {
    modulesQuery,
    filters,
    setFilters,
    resetFilters,
    updateBranchOnModule,
    addBranchOnModule,
  };
}

const ModulesContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function ModulesProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <ModulesContext.Provider value={value}>
      {props.children}
    </ModulesContext.Provider>
  );
}

export function useModulesContext() {
  const modulesContext = React.useContext(ModulesContext);

  if (!modulesContext) {
    throw new Error('useModules has to be used within <ModulesContext>');
  }

  return modulesContext;
}
