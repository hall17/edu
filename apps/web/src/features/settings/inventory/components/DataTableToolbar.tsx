import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { useInventoryContext } from '../context/InventoryContext';
import { deviceCategories } from '../data/data';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
} from '@/components/table';
import { Button } from '@/components/ui/button';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;
  const { filters, setFilters } = useInventoryContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder="Filter inventory..."
          value={filters.q ?? ''}
          onChange={(value) => setFilters({ q: value })}
          onClear={() => setFilters({ q: '' })}
          className="w-[150px] lg:w-[250px]"
        />
        {/* <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title="Status"
              options={[
                { label: 'Assigned', value: 'assigned' },
                { label: 'Returned', value: 'returned' },
                { label: 'Overdue', value: 'overdue' },
                { label: 'Damaged', value: 'damaged' },
              ]}
            />
          )}
          {table.getColumn('deviceType') && (
            <DataTableFacetedFilter
              column={table.getColumn('deviceType')}
              title="Device Type"
              options={deviceCategories.map((deviceType) => ({
                label: deviceType.label,
                value: deviceType.value,
              }))}
            />
          )}
          {table.getColumn('conditionAtAssignment') && (
            <DataTableFacetedFilter
              column={table.getColumn('conditionAtAssignment')}
              title="Condition"
              options={[
                { label: 'Excellent', value: 'excellent' },
                { label: 'Good', value: 'good' },
                { label: 'Fair', value: 'fair' },
                { label: 'Poor', value: 'poor' },
                { label: 'Damaged', value: 'damaged' },
              ]}
            />
          )}
        </div> */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
