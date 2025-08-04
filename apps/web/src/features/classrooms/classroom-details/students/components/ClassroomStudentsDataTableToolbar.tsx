import { IconX } from '@tabler/icons-react';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { useClassroomStudentsContext } from '../ClassroomStudentsContext';

import { SearchInput } from '@/components/SearchInput';
import { DataTableViewOptions } from '@/components/table';
import { Button } from '@/components/ui/button';
import { ClassroomStudent } from '@/lib/trpc';

interface ClassroomStudentsDataTableToolbarProps {
  table: Table<ClassroomStudent>;
}

export function ClassroomStudentsDataTableToolbar({
  table,
}: ClassroomStudentsDataTableToolbarProps) {
  const { t } = useTranslation();
  const { filters, setFilters, resetFilters } = useClassroomStudentsContext();
  const isFiltered = Object.keys(filters).some(
    (key) => key !== 'page' && key !== 'size' && key !== 'classroomId'
  );

  return (
    <div className="flex items-center justify-between pl-1">
      <div className="flex flex-1 items-center space-x-2">
        <SearchInput
          placeholder={t('students.table.searchPlaceholder')}
          value={filters.q ?? ''}
          onChange={(value) => setFilters({ q: value || undefined })}
          onClear={() => setFilters({ q: undefined })}
          className="w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              resetFilters();
              table.resetColumnFilters();
            }}
            className="h-8 px-2 lg:px-3"
          >
            {t('table.actions.clearFilters')}
            <IconX className="ml-2 size-4" />
          </Button>
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
