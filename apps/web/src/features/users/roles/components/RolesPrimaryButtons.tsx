import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useRolesContext } from '../RolesContext';

import { Button } from '@/components/ui/button';

export function RolesPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useRolesContext();

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpenedDialog('create')}>
        <span>{t('roles.buttons.addRole')}</span> <Plus size={18} />
      </Button>
    </div>
  );
}
