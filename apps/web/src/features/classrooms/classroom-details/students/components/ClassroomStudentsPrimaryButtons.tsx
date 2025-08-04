import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { useClassroomStudentsContext } from '../ClassroomStudentsContext';

import { Button } from '@/components/ui/button';

export function ClassroomStudentsPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useClassroomStudentsContext();

  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        onClick={() => setOpenedDialog('enrollment')}
        className="flex items-center space-x-2"
      >
        <IconPlus className="size-4" />
        <span>{t('students.actions.enroll')}</span>
      </Button>
    </div>
  );
}
