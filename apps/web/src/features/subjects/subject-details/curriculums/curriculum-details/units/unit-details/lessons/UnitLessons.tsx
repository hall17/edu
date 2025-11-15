import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { LessonsDialogs } from './dialogs/LessonsDialogs';
import { UnitLessonsDataTableToolbar } from './UnitLessonsDataTableToolbar';
import {
  UnitLessonsProvider,
  useUnitLessonsContext,
} from './UnitLessonsContext';

import { CustomClientTable } from '@/components/table/CustomClientTable';
import { DataTableColumnHeader } from '@/components/table';
import { CustomDataTableRowActions } from '@/components/table/CustomDataTableRowActions';
import {
  Lesson,
  useSubjectDetailsContext,
} from '@/features/subjects/subject-details/SubjectDetailsContext';
import { LongText } from '@/components/LongText';

export function UnitLessonsContent() {
  const { t } = useTranslation();
  const { unit } = useSubjectDetailsContext();
  const columns = useColumns();

  const lessons = unit?.lessons ?? [];

  return (
    <>
      <CustomClientTable
        data={lessons}
        columns={columns}
        CustomToolbar={UnitLessonsDataTableToolbar}
        emptyMessage={t('subjects.curriculums.lessons.table.noResults')}
      />
      <LessonsDialogs />
    </>
  );
}

function useColumns(): ColumnDef<Lesson>[] {
  const { t } = useTranslation();
  const { setOpenedDialog, setCurrentRow } = useUnitLessonsContext();

  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.name')} />
      ),
      meta: {
        className: 'max-w-0 w-full',
      },
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            {row.original.description && (
              <LongText className="text-muted-foreground text-xs">
                {row.original.description}
              </LongText>
            )}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: 'actions-item',
      header: t('common.actions'),
      meta: {
        className: 'text-end',
      },
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <CustomDataTableRowActions
            items={[
              {
                icon: <Edit className="size-4" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('edit');
                },
                tooltip: t('common.edit'),
              },
              {
                icon: <Trash2 className="size-4" />,
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

export function UnitLessons() {
  return (
    <UnitLessonsProvider>
      <UnitLessonsContent />
    </UnitLessonsProvider>
  );
}
