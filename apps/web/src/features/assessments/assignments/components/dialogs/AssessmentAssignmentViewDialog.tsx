import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { useAssessmentAssignmentsContext } from '../../AssessmentAssignmentsContext';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function AssessmentAssignmentViewDialog() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog } = useAssessmentAssignmentsContext();

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t('assessments.assigned.viewDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {t('assessments.assigned.viewDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              {t('assessments.assigned.table.headers.assessment')}:
            </label>
            <div className="col-span-3">{currentRow?.assessment?.title}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              {t('assessments.assigned.table.headers.classroom')}:
            </label>
            <div className="col-span-3">
              {currentRow?.classroomIntegration?.classroom?.name}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              {t('assessments.assigned.table.headers.subject')}:
            </label>
            <div className="col-span-3">
              {currentRow?.classroomIntegration?.subject?.name}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              {t('assessments.assigned.table.headers.startDate')}:
            </label>
            <div className="col-span-3">
              {currentRow?.startDate
                ? format(new Date(currentRow.startDate), 'dd/MM/yyyy HH:mm')
                : '-'}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              {t('assessments.assigned.table.headers.endDate')}:
            </label>
            <div className="col-span-3">
              {currentRow?.endDate
                ? format(new Date(currentRow.endDate), 'dd/MM/yyyy HH:mm')
                : '-'}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">
              {t('assessments.assigned.table.headers.status')}:
            </label>
            <div className="col-span-3 capitalize">
              {currentRow?.status
                ? t(
                    `classroomIntegrationAssessmentStatuses.${currentRow.status}`
                  )
                : '-'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
