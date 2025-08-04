import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useDialogState, useSearchFilters } from '@/hooks';
import { queryClient, trpc, Company } from '@/lib/trpc';

type CompaniesDialogType = 'add' | 'edit' | 'delete' | 'view' | 'suspend';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] =
    useDialogState<CompaniesDialogType>(null);

  const [currentRow, setCurrentRow] = useState<Company | null>(null);
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/_super-management/companies/'
  );

  const companiesQuery = useQuery(trpc.company.findAll.queryOptions(filters));
  const companiesQueryKey = trpc.company.findAll.queryKey(filters);

  const companies = companiesQuery.data?.companies ?? [];

  function createCompany(company: Company) {
    queryClient.setQueryData(companiesQueryKey, (data) => {
      if (!data) {
        return undefined;
      }

      return {
        companies: [company, ...(data?.companies ?? [])],
        pagination: {
          ...data.pagination,
          count: data.pagination.count + 1,
        },
      };
    });
  }

  function updateCompany(company: Company) {
    queryClient.setQueryData(companiesQueryKey, (data) => {
      if (!data) {
        return undefined;
      }

      return {
        ...data,
        companies:
          data?.companies.map((c) => (c.id === company.id ? company : c)) ?? [],
      };
    });
  }

  function deleteCompany(id: number) {
    queryClient.setQueryData(companiesQueryKey, (data) => {
      if (!data) {
        return undefined;
      }

      return {
        companies: data?.companies.filter((company) => company.id !== id) ?? [],
        pagination: {
          ...data.pagination,
          count: data.pagination.count - 1,
        },
      };
    });
  }

  function setOpenedDialogFn(dialog: CompaniesDialogType | null) {
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
    companiesQuery,
    companiesQueryKey,
    filters,
    setFilters,
    resetFilters,
    createCompany,
    updateCompany,
    deleteCompany,
    companies,
  };
}

const CompaniesContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function CompaniesProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <CompaniesContext.Provider value={value}>
      {props.children}
    </CompaniesContext.Provider>
  );
}

export function useCompaniesContext() {
  const companiesContext = React.useContext(CompaniesContext);

  if (!companiesContext) {
    throw new Error(
      'useCompaniesContext has to be used within <CompaniesContext>'
    );
  }

  return companiesContext;
}
