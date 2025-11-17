import { useNavigate } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { LessonsDialogs } from './dialogs/LessonsDialogs';
import {
  UnitLessonsProvider,
  useUnitLessonsContext,
} from './UnitLessonsContext';
import { UnitLessonsDataTableToolbar } from './UnitLessonsDataTableToolbar';

import { LongText } from '@/components/LongText';
import { DataTableColumnHeader } from '@/components/table';
import { CustomClientTable } from '@/components/table/CustomClientTable';
import { CustomDataTableRowActions } from '@/components/table/CustomDataTableRowActions';
import {
  Lesson,
  useSubjectDetailsContext,
} from '@/features/admin/subjects/subject-details/SubjectDetailsContext';

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
  const navigate = useNavigate();
  const { setOpenedDialog, setCurrentRow } = useUnitLessonsContext();
  const { subject, curriculum, unit } = useSubjectDetailsContext();

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
      accessorKey: 'materials',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.materials')} />
      ),
      cell: ({ row }) => {
        const materialsCount = (row.original as any).materials?.length ?? 0;
        return (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {materialsCount}
            </span>
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
                icon: <Eye className="size-4" />,
                onClick: () => {
                  navigate({
                    to: `/subjects/${subject?.id}/curriculums/${curriculum?.id}/units/${unit?.id}/lessons/${row.original.id}`,
                  });
                },
                tooltip: t('common.view'),
              },
              {
                icon: <Plus className="size-4" />,
                onClick: () => {
                  setCurrentRow(row.original);
                  setOpenedDialog('add-material');
                },
                tooltip: t('common.addMaterial'),
              },
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
