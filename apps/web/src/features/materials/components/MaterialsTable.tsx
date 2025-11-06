import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useMaterialsContext } from '../MaterialsContext';

import { getColumns } from './MaterialsColumns';
import { MaterialsDataTableToolbar } from './MaterialsDataTableToolbar';

import { DataTablePagination } from '@/components/table/DataTablePagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/utils/constants';

export function MaterialsTable() {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { curriculumsQuery, filters, setFilters } = useMaterialsContext();
  const columns = getColumns(t);

  const paginationState: PaginationState = {
    pageIndex: filters.page ? filters.page - 1 : DEFAULT_PAGE_INDEX,
    pageSize: filters.size ?? DEFAULT_PAGE_SIZE,
  };

  const sortingState: SortingState = filters.sort
    ? [
        {
          id: filters.sort.split(':')[0] ?? '',
          desc: filters.sort.split(':')[1] === 'desc',
        },
      ]
    : [];

  const columnFiltersState: ColumnFiltersState = [];

  const table = useReactTable({
    data: curriculumsQuery.data?.curriculums ?? [],
    columns,
    state: {
      sorting: sortingState,
      columnVisibility,
      rowSelection,
      columnFilters: columnFiltersState,
      pagination: paginationState,
    },
    enableColumnResizing: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: (pagination) => {
      const newPagination =
        typeof pagination === 'function'
          ? pagination(paginationState)
          : pagination;
      setFilters({
        page:
          newPagination.pageIndex === DEFAULT_PAGE_INDEX
            ? undefined
            : newPagination.pageIndex + 1,
        size:
          newPagination.pageSize === DEFAULT_PAGE_SIZE
            ? undefined
            : newPagination.pageSize,
      });
    },
    onSortingChange: (sorting) => {
      const newSorting =
        typeof sorting === 'function' ? sorting(sortingState) : sorting;

      setFilters({
        sort: newSorting?.length
          ? `${newSorting?.[0]?.id}:${newSorting?.[0]?.desc ? 'desc' : 'asc'}`
          : undefined,
      });
    },
    rowCount: curriculumsQuery.data?.count,
  });

  return (
    <div className="space-y-4">
      <MaterialsDataTableToolbar table={table} />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.meta?.className ?? ''}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ''}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('materials.table.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
