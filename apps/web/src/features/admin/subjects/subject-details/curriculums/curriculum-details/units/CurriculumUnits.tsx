import { useNavigate } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { BookOpen, Edit, Eye, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useSubjectDetailsContext } from '../../../SubjectDetailsContext';

import { UnitsDialogs } from './dialogs/UnitsDialogs';
import { UnitsProvider, useUnitsContext } from './UnitsContext';
import { UnitsDataTableToolbar } from './UnitsDataTableToolbar';

import { LongText } from '@/components/LongText';
import { CustomClientTable } from '@/components/table/CustomClientTable';
import { CustomDataTableRowActions } from '@/components/table/CustomDataTableRowActions';
import { Badge } from '@/components/ui/badge';

export function CurriculumUnitsContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { curriculum } = useSubjectDetailsContext();
  const { setOpenedDialog, setCurrentRow } = useUnitsContext();

  const units = curriculum?.units ?? [];

  const columns: ColumnDef<(typeof units)[number]>[] = [
    {
      accessorKey: 'name',
      header: t('common.name'),
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
    },
    {
      accessorKey: 'lessons',
      header: t('common.lessons'),
      meta: {
        className: 'min-w-36',
      },
      cell: ({ row }) => {
        const count = row.original?.lessons?.length ?? 0;
        return (
          <Badge variant="secondary">
            {count} {t('common.lessons')}
          </Badge>
        );
      },
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
                icon: <BookOpen className="size-4" />,
                onClick: () => {
                  navigate({
                    to: '/subjects/$subjectId/curriculums/$curriculumId/units/$unitId/lessons',
                    params: {
                      subjectId: curriculum?.subjectId || '',
                      curriculumId: curriculum?.id || '',
                      unitId: row.original.id,
                    },
                  });
                  sessionStorage.setItem(
                    'previousUrl',
                    window.location.pathname
                  );
                },
                tooltip: t('common.showLessons'),
              },
              {
                icon: <Eye className="size-4" />,
                onClick: () => {
                  navigate({
                    to: '/subjects/$subjectId/curriculums/$curriculumId/units/$unitId',
                    params: {
                      subjectId: curriculum?.subjectId || '',
                      curriculumId: curriculum?.id || '',
                      unitId: row.original.id,
                    },
                  });
                  sessionStorage.setItem(
                    'previousUrl',
                    window.location.pathname
                  );
                },
                tooltip: t('common.view'),
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

  return (
    <>
      <CustomClientTable
        data={units}
        columns={columns}
        CustomToolbar={UnitsDataTableToolbar}
        emptyMessage={t('subjects.units.table.noResults')}
      />
      <UnitsDialogs />
    </>
  );
}

export function CurriculumUnits() {
  return (
    <UnitsProvider>
      <CurriculumUnitsContent />
    </UnitsProvider>
  );
}
