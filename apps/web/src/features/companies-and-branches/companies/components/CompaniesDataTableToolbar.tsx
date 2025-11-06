import { CompanyStatus } from '@edusama/common';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { useCompaniesContext } from '../CompaniesContext';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableFacetedFilter,
  DataTableResetFilters,
  DataTableViewOptions,
} from '@/components/table';

interface CompaniesDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function CompaniesDataTableToolbar<TData>({
  table,
}: CompaniesDataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;
  const { filters, setFilters } = useCompaniesContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder={t(
            'companiesAndBranches.companies.table.filterPlaceholder'
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
              title={t('companiesAndBranches.companies.table.filters.status')}
              options={Object.values(CompanyStatus).map((status) => ({
                label: t(`companyStatuses.${status}`),
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
