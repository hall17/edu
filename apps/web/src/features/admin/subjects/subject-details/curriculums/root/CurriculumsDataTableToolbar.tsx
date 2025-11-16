import { Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useCurriculumsContext } from './CurriculumsContext';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableResetFilters,
  DataTableViewOptions,
} from '@/components/table';
import { Button } from '@/components/ui/button';

interface CurriculumsDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function CurriculumsDataTableToolbar<TData>({
  table,
}: CurriculumsDataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const { setOpenedDialog } = useCurriculumsContext();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder={t('subjects.curriculums.table.filterPlaceholder')}
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
          size="sm"
          className="h-8"
          onClick={() => setOpenedDialog('add')}
        >
          <Plus />
          {t('subjects.curriculums.addCurriculum')}
        </Button>
      </div>
    </div>
  );
}
