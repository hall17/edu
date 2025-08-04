import { useTranslation } from 'react-i18next';

import { useBranchesContext } from '../../BranchesContext';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function BranchesViewDialog() {
  const { t } = useTranslation();
  const { openedDialog, setOpenedDialog, currentRow } = useBranchesContext();

  const isOpen = openedDialog === 'view';

  if (!currentRow) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('companiesAndBranches.branches.title')}</DialogTitle>
          <DialogDescription>
            {t('companiesAndBranches.branches.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              {t('companiesAndBranches.branches.table.columns.name')}
            </label>
            <p className="text-muted-foreground text-sm">{currentRow.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">
              {t('companiesAndBranches.branches.table.columns.slug')}
            </label>
            <p className="text-muted-foreground text-sm">{currentRow.slug}</p>
          </div>
          <div>
            <label className="text-sm font-medium">
              {t('companiesAndBranches.branches.table.columns.location')}
            </label>
            <p className="text-muted-foreground text-sm">
              {currentRow.location || '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">
              {t('companiesAndBranches.branches.table.columns.contact')}
            </label>
            <p className="text-muted-foreground text-sm">
              {currentRow.contact || '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">
              {t('companiesAndBranches.branches.table.columns.company')}
            </label>
            <p className="text-muted-foreground text-sm">
              {currentRow.company.name}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">
              {t('companiesAndBranches.branches.table.columns.status')}
            </label>
            <div className="mt-1">
              <Badge variant="secondary" className="capitalize">
                {t(`branchStatuses.${currentRow.status}`)}
              </Badge>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpenedDialog(null)}>
            {t('common.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
