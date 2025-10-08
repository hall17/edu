import { BranchStatus } from '@edusama/server';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { useBranchesContext } from '../BranchesContext';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableFacetedFilter,
  DataTableResetFilters,
  DataTableViewOptions,
} from '@/components/table';

interface BranchesDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function BranchesDataTableToolbar<TData>({
  table,
}: BranchesDataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;
  const { filters, setFilters } = useBranchesContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder={t(
            'companiesAndBranches.branches.table.filterPlaceholder'
          )}
          value={filters.q ?? ''}
          onChange={(value) => setFilters({ q: value })}
          onClear={() => setFilters({ q: '' })}
          className="w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title={t('companiesAndBranches.branches.table.filters.status')}
              options={Object.values(BranchStatus).map((status) => ({
                label: t(`branchStatuses.${status}`),
                value: status,
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
