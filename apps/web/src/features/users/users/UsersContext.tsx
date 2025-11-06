import React, { useState } from 'react';

import {
  useDialogState,
  useRolesQuery,
  useSearchFilters,
  useUsersQuery,
} from '@/hooks';
import { queryClient, User } from '@/lib/trpc';

type UsersDialogType =
  | 'invite'
  | 'add'
  | 'edit'
  | 'delete'
  | 'view'
  | 'suspend'
  | 'changePassword';

function useProviderValue() {
  const [openedDialog, setOpenedDialog] = useDialogState<UsersDialogType>(null);

  const [currentRow, setCurrentRow] = useState<User | null>(null);
  const { filters, setFilters, resetFilters } = useSearchFilters(
    '/_authenticated/users/'
  );

  const { usersQuery, usersQueryKey } = useUsersQuery(filters);
  const { rolesQuery } = useRolesQuery();

  const users = usersQuery.data?.users ?? [];
  const roles = rolesQuery.data?.roles ?? [];

  function createUser(user: User) {
    queryClient.setQueryData(usersQueryKey, (data) => {
      if (!data) {
        return undefined;
      }

      return {
        users: [user, ...(data?.users ?? [])],
        count: data?.count ? data.count + 1 : 1,
      };
    });
  }

  function updateUser(user: User) {
    queryClient.setQueryData(usersQueryKey, (data) => {
      if (!data) {
        return undefined;
      }

      return {
        users: data?.users.map((u) => (u.id === user.id ? user : u)) ?? [],
        count: data?.count ?? 0,
      };
    });
  }

  function deleteUser(id: string) {
    queryClient.setQueryData(usersQueryKey, (data) => {
      if (!data) {
        return undefined;
      }

      return {
        users: data?.users.filter((user) => user.id !== id) ?? [],
        count: data?.count ? data.count - 1 : 0,
      };
    });
  }

  function setOpenedDialogFn(dialog: UsersDialogType | null) {
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
    usersQuery,
    usersQueryKey,
    filters,
    setFilters,
    resetFilters,
    createUser,
    updateUser,
    deleteUser,
    users,
    roles,
  };
}

const UsersContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function UsersProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <UsersContext.Provider value={value}>
      {props.children}
    </UsersContext.Provider>
  );
}

export function useUsersContext(): ReturnType<typeof useProviderValue> {
  const usersContext = React.useContext(UsersContext);

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersContext>');
  }

  return usersContext;
}
