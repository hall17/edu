import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useClassroomTemplatesContext } from '../ClassroomTemplatesContext';

import { Button } from '@/components/ui/button';

export function ClassroomTemplatesPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useClassroomTemplatesContext();

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpenedDialog('add')}>
        <span>{t('classrooms.templates.addTemplate')}</span> <Plus size={18} />
      </Button>
    </div>
  );
}
