import { Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useClassroomsContext } from '../ClassroomsContext';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableResetFilters,
  DataTableViewOptions,
} from '@/components/table';
import { Button } from '@/components/ui/button';

interface ClassroomsDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function ClassroomsDataTableToolbar<TData>({
  table,
}: ClassroomsDataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;
  const { filters, setFilters, setOpenedDialog } = useClassroomsContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder={t('classrooms.table.filterPlaceholder')}
          value={filters.q ?? ''}
          onChange={(value) => setFilters({ q: value })}
          onClear={() => setFilters({ q: '' })}
          className="w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {/* Add any filters here if needed */}
        </div>
        {isFiltered && (
          <DataTableResetFilters onClick={() => table.resetColumnFilters()} />
        )}
      </div>
      <div className="flex items-center gap-2">
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
        <div className="flex gap-2">
          <Button onClick={() => setOpenedDialog('add')}>
            <Plus />
            {t('classrooms.buttons.addClassroom')}
          </Button>
        </div>
      </div>
    </div>
  );
}
