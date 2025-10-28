import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useCurriculumsContext } from '../CurriculumsContext';

import { Button } from '@/components/ui/button';

export function CurriculumsPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useCurriculumsContext();

  return (
    <div>
      <Button className="space-x-1" onClick={() => setOpenedDialog('add')}>
        <span>{t('curriculums.buttons.addCurriculum')}</span>
        <Plus size={18} />
      </Button>
    </div>
  );
}
