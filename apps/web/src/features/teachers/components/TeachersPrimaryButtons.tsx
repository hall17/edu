import { MailPlus, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useTeachersContext } from '../TeachersContext';

import { Button } from '@/components/ui/button';

export function TeachersPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useTeachersContext();
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpenedDialog('invite')}
      >
        <span>{t('teachers.buttons.inviteTeacher')}</span>{' '}
        <MailPlus size={18} />
      </Button>
      <Button className="space-x-1" onClick={() => setOpenedDialog('add')}>
        <span>{t('teachers.buttons.addTeacher')}</span> <UserPlus size={18} />
      </Button>
    </div>
  );
}
