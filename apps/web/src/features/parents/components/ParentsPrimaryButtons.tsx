import { IconMailPlus, IconUserPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { useParentsContext } from '../ParentsContext';

import { Button } from '@/components/ui/button';

export function ParentsPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useParentsContext();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpenedDialog('invite')}
      >
        <span>{t('parents.buttons.inviteParent')}</span>{' '}
        <IconMailPlus size={18} />
      </Button>
      <Button className="space-x-1" onClick={() => setOpenedDialog('add')}>
        <span>{t('parents.buttons.addParent')}</span> <IconUserPlus size={18} />
      </Button>
    </div>
  );
}
