import { useTranslation } from 'react-i18next';

import { useCompaniesContext } from '../../CompaniesContext';

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

export function CompaniesViewDialog() {
  const { t } = useTranslation();
  const { openedDialog, setOpenedDialog, currentRow } = useCompaniesContext();

  const isOpen = openedDialog === 'view';

  if (!currentRow) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t('companiesAndBranches.companies.viewDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {t('companiesAndBranches.companies.viewDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              {t('companiesAndBranches.companies.table.columns.name')}
            </label>
            <p className="text-muted-foreground text-sm">{currentRow.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">
              {t('companiesAndBranches.companies.table.columns.slug')}
            </label>
            <p className="text-muted-foreground text-sm">{currentRow.slug}</p>
          </div>
          <div>
            <label className="text-sm font-medium">
              {t('companiesAndBranches.companies.table.columns.status')}
            </label>
            <div className="mt-1">
              <Badge variant="secondary" className="capitalize">
                {t(`companyStatuses.${currentRow.status}`)}
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
