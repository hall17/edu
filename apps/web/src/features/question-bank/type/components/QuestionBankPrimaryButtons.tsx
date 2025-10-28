import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useQuestionBankContext } from '../QuestionBankContext';

import { Button } from '@/components/ui/button';

export function QuestionBankPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useQuestionBankContext();

  return (
    <Button onClick={() => setOpenedDialog('add')} className="h-8 px-2 lg:px-3">
      <Plus className="mr-2 size-4" />
      {t('questionBank.primaryButtons.addQuestion')}
    </Button>
  );
}
