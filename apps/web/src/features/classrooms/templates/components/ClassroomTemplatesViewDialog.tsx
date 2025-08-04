import { useTranslation } from 'react-i18next';

import { useClassroomTemplatesContext } from '../ClassroomTemplatesContext';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export function ClassroomTemplatesViewDialog() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog } = useClassroomTemplatesContext();

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{currentRow.name}</DialogTitle>
          <DialogDescription>
            {t('classrooms.templates.viewDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t('classrooms.templates.viewDialog.basicInfo')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.templates.fields.name')}
                </label>
                <p className="text-sm">{currentRow.name}</p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.templates.fields.capacity')}
                </label>
                <p className="text-sm">{currentRow.capacity}</p>
              </div>
            </div>
            {currentRow.description && (
              <div className="mt-4">
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.templates.fields.description')}
                </label>
                <p className="text-sm">{currentRow.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Passing Scores */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t('classrooms.templates.viewDialog.passingScores')}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.templates.fields.attendancePass')}
                </label>
                <p className="text-sm">
                  {currentRow.attendancePassPercentage}%
                </p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.templates.fields.assessmentPass')}
                </label>
                <p className="text-sm">{currentRow.assessmentScorePass}%</p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.templates.fields.assignmentPass')}
                </label>
                <p className="text-sm">{currentRow.assignmentScorePass}%</p>
              </div>
            </div>
          </div>

          {/* Modules */}
          {currentRow.modules && currentRow.modules.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  {t('classrooms.templates.viewDialog.modules')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentRow.modules.map((module: any) => (
                    <Badge key={module.id} variant="outline">
                      {module.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
