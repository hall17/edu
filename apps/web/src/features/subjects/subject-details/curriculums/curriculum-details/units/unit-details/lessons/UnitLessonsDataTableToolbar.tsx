import { Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useUnitLessonsContext } from './UnitLessonsContext';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableResetFilters,
  DataTableViewOptions,
} from '@/components/table';
import { Button } from '@/components/ui/button';

interface UnitLessonsDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function UnitLessonsDataTableToolbar<TData>({
  table,
}: UnitLessonsDataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const { setOpenedDialog } = useUnitLessonsContext();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder={t(
            'subjects.curriculums.lessons.table.filterPlaceholder'
          )}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(value) => table.getColumn('name')?.setFilterValue(value)}
          onClear={() => table.getColumn('name')?.setFilterValue('')}
          className="w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <DataTableResetFilters onClick={() => table.resetColumnFilters()} />
        )}
      </div>
      <div className="flex gap-x-2">
        {table.getState().sorting.length > 0 && (
          <Button
            variant="secondary"
            className="h-8"
            onClick={() => table.resetSorting()}
          >
            {t('table.actions.resetSort')}
          </Button>
        )}
        <DataTableViewOptions table={table} />
        <Button
          variant="default"
          size="sm"
          className="h-8"
          onClick={() => setOpenedDialog('add')}
        >
          <Plus className="mr-2 size-4" />
          Add Lesson
        </Button>
      </div>
    </div>
  );
}
