import { SubjectStatus } from '@edusama/common';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { useSubjectsContext } from '../SubjectsContext';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableFacetedFilter,
  DataTableResetFilters,
  DataTableViewOptions,
} from '@/components/table';
import { Button } from '@/components/ui/button';

interface SubjectsDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function SubjectsDataTableToolbar<TData>({
  table,
}: SubjectsDataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;
  const { filters, setFilters } = useSubjectsContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder={t('subjects.table.filterPlaceholder')}
          value={filters.q ?? ''}
          onChange={(value) => setFilters({ q: value })}
          onClear={() => setFilters({ q: '' })}
          className="w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title={t('common.status')}
              options={Object.values(SubjectStatus).map((status) => ({
                label: t(`subjectStatuses.${status}`),
                value: status,
              }))}
            />
          )}
        </div>
        {isFiltered && (
          <DataTableResetFilters onClick={() => table.resetColumnFilters()} />
        )}
      </div>
      <div className="flex gap-x-2">
        {filters.sort && (
          <Button
            variant="secondary"
            className="h-8"
            onClick={() => setFilters({ sort: undefined })}
          >
            {t('table.actions.resetSort')}
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
