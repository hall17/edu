import { IconMailPlus, IconUserPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { useStudentsContext } from '../StudentsContext';

import { Button } from '@/components/ui/button';

export function StudentsPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useStudentsContext();
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpenedDialog('invite')}
      >
        <span>{t('students.buttons.inviteStudent')}</span>{' '}
        <IconMailPlus size={18} />
      </Button>
      <Button className="space-x-1" onClick={() => setOpenedDialog('add')}>
        <span>{t('students.buttons.addStudent')}</span>{' '}
        <IconUserPlus size={18} />
      </Button>
    </div>
  );
}
