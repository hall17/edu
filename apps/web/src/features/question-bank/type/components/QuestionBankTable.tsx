import { QuestionDifficulty } from '@edusama/server';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { ColumnFiltersState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { useQuestionBankContext } from '../QuestionBankContext';

import { QuestionBankDataTableToolbar } from './QuestionBankDataTableToolbar';

import { LongText } from '@/components/LongText';
import { CustomTable } from '@/components/table';
import { DataTableColumnHeader } from '@/components/table';
import { CustomDataTableRowActions } from '@/components/table/CustomDataTableRowActions';
import { SelectItemColumnDef } from '@/components/table/SelectItemColumnDef';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/lib/trpc';
import { getQuestionDifficultyBadgeVariant } from '@/utils';

export function QuestionBankTable() {
  const { questionsQuery, filters, setFilters } = useQuestionBankContext();
  const columns = useColumns();
  console.log('filters', filters);

  const columnFiltersState: ColumnFiltersState = [];

  if (filters.difficulty) {
    columnFiltersState.push({
      id: 'difficulty',
      value: filters.difficulty,
    });
  }

  if (filters.subjectIds) {
    columnFiltersState.push({
      id: 'subject',
      value: filters.subjectIds,
    });
  }

  if (filters.curriculumIds) {
    columnFiltersState.push({
      id: 'curriculum',
      value: filters.curriculumIds,
    });
  }

  if (filters.lessonIds) {
    columnFiltersState.push({
      id: 'lesson',
      value: filters.lessonIds,
    });
  }

  console.log('filters', filters);

  return (
    <CustomTable
      data={questionsQuery.data?.questions ?? []}
      rowCount={questionsQuery.data?.count ?? 0}
      columns={columns}
      filters={filters}
      setFilters={setFilters}
      columnFiltersState={columnFiltersState}
      onColumnFiltersChange={(columnFilters) => {
        setFilters({
          ...filters,
          difficulty: columnFilters.find((c) => c.id === 'difficulty')?.value
            ? columnFilters.find((c) => c.id === 'difficulty')?.value
            : undefined,
          subjectIds: columnFilters.find((c) => c.id === 'subject')?.value
            ? columnFilters.find((c) => c.id === 'subject')?.value
            : undefined,
          curriculumIds: columnFilters.find((c) => c.id === 'curriculum')
            ? columnFilters.find((c) => c.id === 'curriculum')?.value
            : undefined,
          lessonIds: columnFilters.find((c) => c.id === 'lesson')?.value
            ? columnFilters.find((c) => c.id === 'lesson')?.value
            : undefined,
        });
      }}
      CustomToolbar={QuestionBankDataTableToolbar}
    />
  );
}

export function useColumns(): ColumnDef<Question>[] {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useQuestionBankContext();

  return [
    SelectItemColumnDef as ColumnDef<Question>,
    {
      accessorKey: 'questionText',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('questionBank.table.questionText')}
        />
      ),
      cell: ({ row }) => {
        const questionText = row.getValue('questionText') as string;
        return <LongText className="max-w-96">{questionText}</LongText>;
      },
      enableResizing: true,
    },
    {
      accessorKey: 'difficulty',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('questionBank.table.difficulty')}
        />
      ),
      cell: ({ row }) => {
        const difficulty = row.original.difficulty;
        return (
          <Badge
            variant={getQuestionDifficultyBadgeVariant(
              difficulty as QuestionDifficulty
            )}
            className="capitalize"
          >
            {t(`questionDifficulties.${difficulty}`)}
          </Badge>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'subject',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('questionBank.table.subject')}
        />
      ),
      cell: ({ row }) => {
        const subject = row.original.subject;
        return subject ? (
          <div className="w-fit text-nowrap">{subject.name}</div>
        ) : null;
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'curriculum',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('questionBank.table.curriculum')}
        />
      ),
      cell: ({ row }) => {
        const curriculum = row.original.curriculum;
        return curriculum ? (
          <div className="w-fit text-nowrap">{curriculum.name}</div>
        ) : null;
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'lesson',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('questionBank.table.lesson')}
        />
      ),
      cell: ({ row }) => {
        const lesson = row.original.lesson;
        return lesson ? (
          <div className="w-fit text-nowrap">{lesson.name}</div>
        ) : null;
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'actions-item',
      header: t('common.actions'),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <CustomDataTableRowActions
            items={[
              {
                icon: <IconEye className="size-5" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('view');
                },
                tooltip: t('common.view'),
              },
              {
                icon: <IconEdit className="size-5" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('edit');
                },
                tooltip: t('common.edit'),
              },
              {
                icon: <IconTrash className="size-5" />,
                className: 'hover:text-red-500',
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('delete');
                },
                tooltip: t('common.delete'),
              },
            ]}
          />
        );
      },
    },
  ];
}
