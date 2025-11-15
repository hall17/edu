import { ColumnDef } from '@tanstack/react-table';
import { Edit, List, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';

import { useSubjectDetailsContext } from '../../SubjectDetailsContext';
import { CurriculumsDialogs } from './dialogs/CurriculumsDialogs';
import {
  CurriculumsProvider,
  useCurriculumsContext,
} from './CurriculumsContext';
import { CurriculumsDataTableToolbar } from './CurriculumsDataTableToolbar';

import { LongText } from '@/components/LongText';
import { CustomClientTable, DataTableColumnHeader } from '@/components/table';
import { CustomDataTableRowActions } from '@/components/table/CustomDataTableRowActions';
import { Badge } from '@/components/ui/badge';
import { Subject } from '@/lib/trpc';
import { getStatusBadgeVariant } from '@/utils';

type Curriculum = NonNullable<Subject['curriculums']>[number];

export function SubjectCurriculumsContent() {
  const { subject } = useSubjectDetailsContext();
  const columns = useColumns();

  const curriculums = subject?.curriculums ?? [];

  return (
    <>
      <CustomClientTable
        data={curriculums}
        columns={columns}
        CustomToolbar={CurriculumsDataTableToolbar}
        emptyMessage={useTranslation().t('subjects.details.noCurriculums')}
      />
      <CurriculumsDialogs />
    </>
  );
}

function useColumns(): ColumnDef<Curriculum>[] {
  const { t } = useTranslation();
  const { subjectId } = useSubjectDetailsContext();
  const { setOpenedDialog, setCurrentRow } = useCurriculumsContext();
  const navigate = useNavigate();

  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subjects.curriculums.table.curriculum')}
        />
      ),
      cell: ({ row }) => (
        <LongText className="max-w-24">{row.getValue('name')}</LongText>
      ),
      enableHiding: true,
      enableResizing: true,
      enableSorting: true,
    },
    {
      id: 'units',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subjects.curriculums.table.units')}
        />
      ),
      cell: ({ row }) => {
        const count = row.original.units?.length || 0;
        return (
          <Badge variant="secondary">
            {count} {t('subjects.curriculums.table.unit', { count })}
          </Badge>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.status')} />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getStatusBadgeVariant(row.original.status)}
          className="capitalize"
        >
          {t(`curriculumStatuses.${row.original.status}`)}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: false,
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
                icon: <List className="size-4" />,
                onClick: () => {
                  if (!subjectId) {
                    return;
                  }

                  navigate({
                    to: '/subjects/$subjectId/curriculums/$curriculumId/units',
                    params: {
                      subjectId,
                      curriculumId: row.original.id,
                    },
                  });
                },
                tooltip: t('subjects.curriculums.table.actions.viewUnits'),
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

export function SubjectCurriculums() {
  return (
    <CurriculumsProvider>
      <SubjectCurriculumsContent />
    </CurriculumsProvider>
  );
}
