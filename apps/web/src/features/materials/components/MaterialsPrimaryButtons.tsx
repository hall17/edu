import { IconPlus, IconSettings } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { useMaterialsContext } from '../MaterialsContext';

import { Button } from '@/components/ui/button';

export function MaterialsPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpen } = useMaterialsContext();

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add-curriculum')}>
        <span>{t('materials.buttons.addCurriculum')}</span>
        <IconPlus size={18} />
      </Button>
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpen('add-subject')}
      >
        <span>{t('materials.buttons.addSubject')}</span>
        <IconPlus size={18} />
      </Button>
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpen('manage-subjects')}
      >
        <span>{t('materials.buttons.manageSubjects')}</span>
        <IconSettings size={18} />
      </Button>
    </div>
  );
}
