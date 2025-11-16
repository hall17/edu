import { UserStatus } from '@edusama/common';
import { Table } from '@tanstack/react-table';
import { MailPlus, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useParentsContext } from '../ParentsContext';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableFacetedFilter,
  DataTableResetFilters,
  DataTableViewOptions,
} from '@/components/table';
import { Button } from '@/components/ui/button';

interface ParentsDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function ParentsDataTableToolbar<TData>({
  table,
}: ParentsDataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;
  const { filters, setFilters, setOpenedDialog } = useParentsContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder={t('parents.table.filterPlaceholder')}
          value={filters.q ?? ''}
          onChange={(value) => setFilters({ q: value })}
          onClear={() => setFilters({ q: '' })}
          className="w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title={t('parents.table.filters.status')}
              options={Object.values(UserStatus).map((status) => ({
                label: t(`userStatuses.${status}`),
                value: status,
              }))}
            />
          )}
        </div>
        {isFiltered && (
          <DataTableResetFilters onClick={() => table.resetColumnFilters()} />
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpenedDialog('invite')}>
            <MailPlus />
            {t('parents.buttons.inviteParent')}
          </Button>
          <Button onClick={() => setOpenedDialog('add')}>
            <UserPlus />
            {t('parents.buttons.addParent')}
          </Button>
        </div>
      </div>
    </div>
  );
}
