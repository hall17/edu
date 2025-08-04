import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { useBranchesContext } from '../BranchesContext';

import { Button } from '@/components/ui/button';

export function BranchesPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useBranchesContext();

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpenedDialog('add')}>
        <span>{t('companiesAndBranches.buttons.addBranch')}</span>{' '}
        <IconPlus size={18} />
      </Button>
    </div>
  );
}
