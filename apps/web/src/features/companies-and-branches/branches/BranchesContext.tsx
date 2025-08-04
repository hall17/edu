import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { getQueryKey } from '@trpc/react-query';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters } from '@/hooks';
import { queryClient, trpc, Branch } from '@/lib/trpc';

type BranchesDialogType = 'add' | 'edit' | 'delete' | 'view' | 'suspend';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useDialogState<BranchesDialogType>(null);

  const [currentRow, setCurrentRow] = useState<Branch | null>(null);
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/_super-management/companies/branches'
  );

  const branchesQuery = useQuery(trpc.branch.findAll.queryOptions(filters));
  const branchesQueryKey = trpc.branch.findAll.queryKey(filters);

  const companiesQuery = useQuery(
    trpc.company.findAll.queryOptions({ all: true })
  );
  const companiesQueryKey = trpc.company.findAll.queryKey({ all: true });

  const branches = branchesQuery.data?.branches ?? [];

  function createBranch(branch: Branch) {
    queryClient.setQueryData(branchesQueryKey, (data) => {
      if (!data) {
        return undefined;
      }

      return {
        branches: [branch, ...(data?.branches ?? [])],
        pagination: {
          ...data.pagination,
          count: data.pagination.count + 1,
        },
      };
    });
  }

  function updateBranch(branch: Branch) {
    queryClient.setQueryData(branchesQueryKey, (data) => {
      if (!data) {
        return undefined;
      }

      return {
        branches:
          data?.branches.map((b) => (b.id === branch.id ? branch : b)) ?? [],
        pagination: {
          ...data.pagination,
          count: data.pagination.count + 1,
        },
      };
    });
  }

  function deleteBranch(id: number) {
    queryClient.setQueryData(branchesQueryKey, (data) => {
      if (!data) {
        return undefined;
      }

      return {
        branches: data?.branches.filter((branch) => branch.id !== id) ?? [],
        pagination: {
          ...data.pagination,
          count: data.pagination.count - 1,
        },
      };
    });
  }

  function setOpenedDialogFn(dialog: BranchesDialogType | null) {
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
    branchesQuery,
    branchesQueryKey,
    filters,
    setFilters,
    resetFilters,
    createBranch,
    updateBranch,
    deleteBranch,
    branches,
    companies: companiesQuery.data?.companies ?? [],
  };
}

const BranchesContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function BranchesProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <BranchesContext.Provider value={value}>
      {props.children}
    </BranchesContext.Provider>
  );
}

export function useBranchesContext() {
  const branchesContext = React.useContext(BranchesContext);

  if (!branchesContext) {
    throw new Error(
      'useBranchesContext has to be used within <BranchesContext>'
    );
  }

  return branchesContext;
}
