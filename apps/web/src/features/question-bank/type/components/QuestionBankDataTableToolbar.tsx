import { QuestionDifficulty, QuestionType } from '@edusama/server';
import { IconPlus } from '@tabler/icons-react';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { useQuestionBankContext } from '../QuestionBankContext';

import { SearchInput } from '@/components/SearchInput';
import {
  DataTableFacetedFilter,
  DataTableResetFilters,
  DataTableViewOptions,
} from '@/components/table';
import { Button } from '@/components/ui/button';

interface QuestionBankDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function QuestionBankDataTableToolbar<TData>({
  table,
}: QuestionBankDataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const { filters, setFilters, resetFilters, subjectsQuery } =
    useQuestionBankContext();
  const columnFilters = table.getState().columnFilters;
  const columnFiltersWithoutType = columnFilters.filter((c) => c.id !== 'type');
  const isFiltered = columnFiltersWithoutType.length > 0;

  const subjects = subjectsQuery.data?.subjects ?? [];

  const curriculumsFlat =
    subjects?.flatMap((s) =>
      s.curriculums.map((c) => ({
        ...c,
        subjectId: s.id,
      }))
    ) ?? [];
  const curriculums =
    (filters.subjectIds?.length
      ? curriculumsFlat?.filter((c) =>
          filters.subjectIds?.includes(c.subjectId)
        )
      : curriculumsFlat
    )?.filter((c) => c._count.questions > 0) ?? [];

  return (
    <div className="flex flex-1 items-center justify-between space-x-2">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          placeholder={t('questionBank.table.searchPlaceholder')}
          value={(filters as any).q || ''}
          onChange={(value) =>
            setFilters({
              ...filters,
              q: value,
            } as any)
          }
          onClear={() =>
            setFilters({
              ...filters,
              q: '',
            } as any)
          }
          className="w-[150px] lg:w-[250px]"
        />

        <div className="flex gap-x-2">
          {table.getColumn('difficulty') && (
            <DataTableFacetedFilter
              column={table.getColumn('difficulty')}
              title={t('questionBank.table.filters.difficulty')}
              options={Object.values(QuestionDifficulty).map((difficulty) => ({
                label: t(`questionDifficulties.${difficulty}`),
                value: difficulty,
              }))}
            />
          )}
          {table.getColumn('subject') && (
            <DataTableFacetedFilter
              column={table.getColumn('subject')}
              selectedValues={new Set(filters.subjectIds)}
              facets={
                new Map(
                  subjects?.map((subject) => [
                    subject.id,
                    subject._count.questions,
                  ])
                )
              }
              title={t('questionBank.table.filters.subject')}
              options={
                subjects?.map((subject) => ({
                  label: subject.name,
                  value: subject.id,
                })) ?? []
              }
            />
          )}
          {table.getColumn('curriculum') && (
            <DataTableFacetedFilter
              column={table.getColumn('curriculum')}
              selectedValues={new Set(filters.curriculumIds)}
              facets={
                new Map(
                  curriculums?.map((curriculum) => [
                    curriculum.id,
                    curriculum._count.questions,
                  ])
                )
              }
              title={t('questionBank.table.filters.curriculum')}
              options={
                curriculums?.map((curriculum) => ({
                  label: curriculum.name,
                  value: curriculum.id,
                })) ?? []
              }
            />
          )}
        </div>

        {isFiltered && (
          <DataTableResetFilters onClick={() => table.resetColumnFilters()} />
        )}
      </div>
      <div className="flex gap-x-2">
        {(filters as any).sort && (
          <Button
            variant="secondary"
            className="h-8"
            onClick={() => setFilters({ sort: undefined } as any)}
          >
            {t('table.actions.resetSort')}
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
