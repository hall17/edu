import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { useMaterialsContext } from '../MaterialsContext';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Curriculum } from '@/lib/trpc';

interface MaterialsDataTableRowActionsProps {
  row: Row<Curriculum>;
}

export function MaterialsDataTableRowActions({
  row,
}: MaterialsDataTableRowActionsProps) {
  const { t } = useTranslation();
  const { setOpen, setCurrentRow } = useMaterialsContext();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
            onClick={() => {
              setCurrentRow(row.original);
              setOpen('view-curriculum');
            }}
          >
            <IconEye className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('materials.table.actions.view')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
            onClick={() => {
              setCurrentRow(row.original);
              setOpen('edit-curriculum');
            }}
          >
            <IconEdit className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('materials.table.actions.edit')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0 hover:text-red-500"
            onClick={() => {
              setCurrentRow(row.original);
              setOpen('delete-curriculum');
            }}
          >
            <IconTrash className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('materials.table.actions.delete')}</TooltipContent>
      </Tooltip>
    </div>
  );
}
