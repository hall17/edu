import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { FileText, Video, Headphones, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import { CustomClientTable } from '@/components/table/CustomClientTable';
import { DataTableColumnHeader } from '@/components/table';
import { LongText } from '@/components/LongText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LessonMaterial,
  useSubjectDetailsContext,
} from '@/features/subjects/subject-details/SubjectDetailsContext';
import { trpc } from '@/lib/trpc';
import { MaterialViewerDialog } from './MaterialViewerDialog';

export function LessonMaterials() {
  const { t } = useTranslation();
  const { lesson } = useSubjectDetailsContext();
  const [selectedMaterial, setSelectedMaterial] =
    useState<LessonMaterial | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleViewMaterial = (material: LessonMaterial) => {
    setSelectedMaterial(material);
    setIsViewerOpen(true);
  };

  const materials = lesson?.materials ?? [];

  const columns: ColumnDef<LessonMaterial>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.name')} />
      ),
      meta: {
        className: 'max-w-0 w-full',
      },
      cell: ({ row }) => {
        const getTypeIcon = (type: string) => {
          switch (type) {
            case 'VIDEO':
              return <Video className="h-4 w-4 text-blue-500" />;
            case 'AUDIO':
              return <Headphones className="h-4 w-4 text-green-500" />;
            default:
              return <FileText className="h-4 w-4 text-gray-500" />;
          }
        };

        return (
          <div className="flex items-center gap-2">
            {getTypeIcon(row.original.type)}
            <div className="flex flex-col">
              <span className="font-medium">{row.original.name}</span>
              {row.original.description && (
                <LongText className="text-muted-foreground text-xs">
                  {row.original.description}
                </LongText>
              )}
            </div>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.type')} />
      ),
      cell: ({ row }) => <Badge variant="secondary">{row.original.type}</Badge>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewMaterial(row.original)}
        >
          <Eye className="mr-1 h-4 w-4" />
          {t('common.view')}
        </Button>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'isShareable',
      header: t('materials.table.shareable'),
      cell: ({ row }) => (
        <Badge variant={row.original.isShareable ? 'default' : 'secondary'}>
          {row.original.isShareable ? t('common.yes') : t('common.no')}
        </Badge>
      ),
      enableSorting: true,
      enableHiding: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            {t('subjects.lessons.details.tabs.materials')}
          </h3>
          <p className="text-muted-foreground text-sm">
            {t('subjects.lessons.materials.description')}
          </p>
        </div>
      </div>

      <CustomClientTable
        data={materials}
        columns={columns}
        emptyMessage={t('subjects.lessons.materials.noMaterials')}
      />

      <MaterialViewerDialog
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        material={selectedMaterial}
      />
    </div>
  );
}
