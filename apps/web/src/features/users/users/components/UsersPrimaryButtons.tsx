import { IconMailPlus, IconUserPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { useUsersContext } from '../UsersContext';

import { Button } from '@/components/ui/button';

export function UsersPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useUsersContext();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpenedDialog('invite')}
      >
        <span>{t('users.buttons.inviteUser')}</span> <IconMailPlus size={18} />
      </Button>
      <Button className="space-x-1" onClick={() => setOpenedDialog('add')}>
        <span>{t('users.buttons.addUser')}</span> <IconUserPlus size={18} />
      </Button>
    </div>
  );
}
