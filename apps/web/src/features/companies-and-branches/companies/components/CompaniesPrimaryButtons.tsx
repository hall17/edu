import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useCompaniesContext } from '../CompaniesContext';

import { Button } from '@/components/ui/button';

export function CompaniesPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useCompaniesContext();

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpenedDialog('add')}>
        <span>{t('companiesAndBranches.buttons.addCompany')}</span>{' '}
        <Plus size={18} />
      </Button>
    </div>
  );
}
