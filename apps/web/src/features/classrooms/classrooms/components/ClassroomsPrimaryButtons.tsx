import { Plus, Layout, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useClassroomsContext } from '../ClassroomsContext';

import { Button } from '@/components/ui/button';

export function ClassroomsPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useClassroomsContext();

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpenedDialog('add')}>
        <span>{t('classrooms.buttons.addClassroom')}</span>
        <Plus size={18} />
      </Button>
    </div>
  );
}
