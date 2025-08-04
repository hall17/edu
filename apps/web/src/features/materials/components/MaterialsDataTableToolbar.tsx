import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { useMaterialsContext } from '../MaterialsContext';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableResetFilters,
  DataTableViewOptions,
} from '@/components/table';
import { Button } from '@/components/ui/button';

interface MaterialsDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function MaterialsDataTableToolbar<TData>({
  table,
}: MaterialsDataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;
  const { filters, setFilters } = useMaterialsContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder={t('materials.table.filterPlaceholder')}
          value={filters.q ?? ''}
          onChange={(value) => setFilters({ q: value })}
          onClear={() => setFilters({ q: '' })}
          className="w-[150px] lg:w-[250px]"
        />
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
