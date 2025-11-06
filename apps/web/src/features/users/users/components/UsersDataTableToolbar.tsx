import { UserStatus } from '@edusama/common';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { useUsersContext } from '../UsersContext';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableFacetedFilter,
  DataTableResetFilters,
  DataTableViewOptions,
} from '@/components/table';

interface UsersDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function UsersDataTableToolbar<TData>({
  table,
}: UsersDataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;
  const { filters, setFilters, users, roles } = useUsersContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder={t('users.table.filterPlaceholder')}
          value={filters.q ?? ''}
          onChange={(value) => setFilters({ q: value })}
          onClear={() => setFilters({ q: '' })}
          className="w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title={t('users.table.filters.status')}
              options={Object.values(UserStatus).map((status) => ({
                label: t(`userStatuses.${status}`),
                value: status,
              }))}
            />
          )}
          {table.getColumn('role') && (
            <DataTableFacetedFilter
              column={table.getColumn('role')}
              selectedValues={new Set(filters.roleIds)}
              facets={
                new Map(roles.map((role) => [role.id, role._count.users]))
              }
              title={t('users.table.filters.role')}
              options={roles.map((role) => ({
                label: role.name,
                value: role.id,
              }))}
            />
          )}
        </div>
        {isFiltered && (
          <DataTableResetFilters onClick={() => table.resetColumnFilters()} />
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
