import { Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useUnitsContext } from './UnitsContext';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableResetFilters,
  DataTableViewOptions,
} from '@/components/table';
import { Button } from '@/components/ui/button';

interface UnitsDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function UnitsDataTableToolbar<TData>({
  table,
}: UnitsDataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const { setOpenedDialog } = useUnitsContext();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder={t('subjects.units.table.filterPlaceholder')}
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
        <DataTableViewOptions table={table} />
        <Button
          variant="default"
          size="sm"
          className="h-8"
          onClick={() => setOpenedDialog('add')}
        >
          <Plus className="size-4" />
          {t('subjects.units.addUnit')}
        </Button>
      </div>
    </div>
  );
}
