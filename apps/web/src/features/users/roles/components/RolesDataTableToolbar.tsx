import { RoleStatus } from '@edusama/common';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { useRolesContext } from '../RolesContext';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableFacetedFilter,
  DataTableResetFilters,
  DataTableViewOptions,
} from '@/components/table';
import { Role } from '@/lib/trpc';

interface RolesDataTableToolbarProps<TData extends Role> {
  table: Table<TData>;
}

export function RolesDataTableToolbar<TData extends Role>({
  table,
}: RolesDataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;
  const { filters, roles } = useRolesContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder={t('roles.table.filterPlaceholder')}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(value) => table.getColumn('name')?.setFilterValue(value)}
          onClear={() => table.getColumn('name')?.setFilterValue('')}
          className="w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              selectedValues={new Set(filters.status)}
              facets={
                new Map([
                  [
                    RoleStatus.ACTIVE,
                    roles.filter((r) => r.status === RoleStatus.ACTIVE).length,
                  ],
                  [
                    RoleStatus.SUSPENDED,
                    roles.filter((r) => r.status === RoleStatus.SUSPENDED)
                      .length,
                  ],
                ])
              }
              title={t('roles.table.filters.status')}
              options={[
                {
                  label: t('roleStatuses.ACTIVE'),
                  value: RoleStatus.ACTIVE,
                },
                {
                  label: t('roleStatuses.SUSPENDED'),
                  value: RoleStatus.SUSPENDED,
                },
              ]}
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
