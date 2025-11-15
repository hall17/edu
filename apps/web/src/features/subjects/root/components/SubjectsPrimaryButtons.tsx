import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useSubjectsContext } from '../SubjectsContext';

import { Button } from '@/components/ui/button';

export function SubjectsPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useSubjectsContext();

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpenedDialog('add')}>
        <span>{t('subjects.buttons.addSubject')}</span>
        <Plus size={18} />
      </Button>
    </div>
  );
}
