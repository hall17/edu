import React, { useState } from 'react';

import { useDialogState, useSearchFilters, useRolesQuery } from '@/hooks';
import { queryClient, Role } from '@/lib/trpc';

type RolesDialogType = 'create' | 'edit' | 'delete' | 'view' | 'suspend';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] = useDialogState<RolesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Role | null>(null);

  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/users/roles'
  );

  const { rolesQuery, rolesQueryKey } = useRolesQuery(filters);

  const roles = rolesQuery.data?.roles ?? [];

  function createRole(role: Role) {
    queryClient.setQueryData(rolesQueryKey, (data: typeof rolesQuery.data) => {
      return {
        roles: [role, ...(data?.roles ?? [])],
        count: data?.count ? data.count + 1 : 1,
      };
    });
  }

  function updateRole(role: Role) {
    queryClient.setQueryData(rolesQueryKey, (data: typeof rolesQuery.data) => {
      return {
        roles: data?.roles.map((r) => (r.id === role.id ? role : r)) ?? [],
        count: data?.count ?? 0,
      };
    });
  }

  function deleteRole(id: string) {
    queryClient.setQueryData(rolesQueryKey, (data: typeof rolesQuery.data) => {
      return {
        roles: data?.roles.filter((role) => role.id !== id) ?? [],
        count: data?.count ? data.count - 1 : 0,
      };
    });
  }

  function setOpenedDialogFn(dialog: RolesDialogType | null) {
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
    currentRow: currentRow! as Role,
    setCurrentRow,
    rolesQuery,
    rolesQueryKey,
    filters,
    setFilters,
    resetFilters,
    createRole,
    updateRole,
    deleteRole,
    roles,
  };
}

const RolesContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function RolesProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <RolesContext.Provider value={value}>
      {props.children}
    </RolesContext.Provider>
  );
}

export function useRolesContext() {
  const rolesContext = React.useContext(RolesContext);

  if (!rolesContext) {
    throw new Error('useRoles has to be used within <RolesContext>');
  }

  return rolesContext;
}
