import { useTranslation } from 'react-i18next';

import { useAssessmentsContext } from '../../AssessmentsContext';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type AssessmentsDialogType = 'add' | 'edit' | 'delete' | 'view';

export function AssessmentViewDialog() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog } = useAssessmentsContext();

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('assessments.viewDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('assessments.viewDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              {t('assessments.fields.title')}:
            </label>
            <div className="col-span-3">{currentRow?.title}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              {t('assessments.fields.description')}:
            </label>
            <div className="col-span-3">
              {currentRow?.description || t('assessments.fields.noDescription')}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              {t('assessments.maxPoints')}:
            </label>
            <div className="col-span-3">{currentRow?.maxPoints}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              {t('assessments.scheduleType')}:
            </label>
            <div className="col-span-3 capitalize">
              {t(`assessmentScheduleTypes.${currentRow?.scheduleType}`)}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              {t('assessments.scoringType')}:
            </label>
            <div className="col-span-3 capitalize">
              {t(`assessmentScoringTypes.${currentRow?.scoringType}`)}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              {t('assessments.fields.status')}:
            </label>
            <div className="col-span-3 capitalize">
              {t(`assessmentStatuses.${currentRow?.status}`)}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              {t('assessments.fields.subject')}:
            </label>
            <div className="col-span-3">{currentRow?.subject?.name}</div>
          </div>
          {currentRow?.curriculum && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">
                {t('assessments.fields.curriculum')}:
              </label>
              <div className="col-span-3">{currentRow.curriculum.name}</div>
            </div>
          )}
          {currentRow?.lesson && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">
                {t('assessments.fields.lesson')}:
              </label>
              <div className="col-span-3">{currentRow.lesson.name}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
