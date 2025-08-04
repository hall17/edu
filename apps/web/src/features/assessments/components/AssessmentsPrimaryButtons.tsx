import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAssessmentsContext } from '../AssessmentsContext';

import { Button } from '@/components/ui/button';

export function AssessmentsPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useAssessmentsContext();

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => setOpenedDialog('add')}
        className="h-8 px-2 lg:px-3"
      >
        <Plus className="mr-2 h-4 w-4" />
        {t('assessments.addAssessment')}
      </Button>
    </div>
  );
}
