import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAssessmentsContext } from '../AssessmentsContext';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function AssessmentsDataTableToolbar() {
  const { t } = useTranslation();
  const { assessments, setOpenedDialog } = useAssessmentsContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {assessments.length > 0 ? (
          <Badge variant="secondary">
            {t('common.totalCount', {
              count: assessments.length.toString(),
            } as any)}
          </Badge>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setOpenedDialog('add')}
          className="h-8 px-2 lg:px-3"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('assessments.addAssessment')}
        </Button>
      </div>
    </div>
  );
}
