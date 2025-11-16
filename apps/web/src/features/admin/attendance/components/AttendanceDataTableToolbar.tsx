import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { useAttendanceContext } from '../AttendanceContext';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableFacetedFilter,
  DataTableResetFilters,
  DataTableViewOptions,
} from '@/components/table';
import { Button } from '@/components/ui/button';

interface AttendanceDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function AttendanceDataTableToolbar<TData>({
  table,
}: AttendanceDataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;
  const { filters, setFilters } = useAttendanceContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder={t('attendance.table.filterPlaceholder')}
          value={filters.q ?? ''}
          onChange={(value) => setFilters({ q: value })}
          onClear={() => setFilters({ q: '' })}
          className="w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('classroom.name') && (
            <DataTableFacetedFilter
              column={table.getColumn('classroom.name')}
              title={t('attendance.table.filters.classroom')}
              options={[]} // This would need to be populated with actual classroom options
            />
          )}
          {table.getColumn('subject.name') && (
            <DataTableFacetedFilter
              column={table.getColumn('subject.name')}
              title={t('attendance.table.filters.subject')}
              options={[]} // This would need to be populated with actual subject options
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
