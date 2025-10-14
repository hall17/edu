import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useClassroomsContext } from '@/features/classrooms/classrooms/ClassroomsContext';
import { Classroom } from '@/lib/trpc';

interface Props {
  currentRow: Classroom;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassroomsViewDialog() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog } = useClassroomsContext();

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{currentRow.name}</DialogTitle>
          <DialogDescription>
            {t('classrooms.viewDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t('classrooms.viewDialog.basicInfo')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.table.name')}
                </label>
                <p className="text-sm">{currentRow.name}</p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.table.capacity')}
                </label>
                <p className="text-sm">{currentRow.capacity}</p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.table.startDate')}
                </label>
                <p className="text-sm">
                  {new Date(currentRow.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.table.endDate')}
                </label>
                <p className="text-sm">
                  {new Date(currentRow.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.table.branch')}
                </label>
                <p className="text-sm">{currentRow.branch.name}</p>
              </div>
              {currentRow.classroomTemplate && (
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    {t('classrooms.table.template')}
                  </label>
                  <p className="text-sm">{currentRow.classroomTemplate.name}</p>
                </div>
              )}
            </div>
            {currentRow.description && (
              <div className="mt-4">
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.table.description')}
                </label>
                <p className="text-sm">{currentRow.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Passing Scores */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t('classrooms.viewDialog.passingScores')}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.viewDialog.attendancePass')}
                </label>
                <p className="text-sm">
                  {currentRow.attendancePassPercentage}%
                </p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.viewDialog.assessmentPass')}
                </label>
                <p className="text-sm">{currentRow.assessmentScorePass}%</p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.viewDialog.assignmentPass')}
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
                  {t('classrooms.viewDialog.modules')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentRow.modules.map((module) => (
                    <Badge key={module.moduleId} variant="outline">
                      {module.module.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Schedule */}
          {/* {currentRow.schedules && currentRow.schedules.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  {t('classrooms.viewDialog.schedule')}
                </h3>
                <div className="space-y-2">
                  {currentRow.schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={schedule.isActive ? 'default' : 'secondary'}
                        >
                          {t(`days.${schedule.dayOfWeek}`)}
                        </Badge>
                        <span className="text-sm">
                          {dayjs(schedule.startTime).format('HH:mm')} -{' '}
                          {dayjs(schedule.endTime).format('HH:mm')}
                        </span>
                      </div>
                      {!schedule.isActive && (
                        <Badge variant="outline">{t('common.inactive')}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )} */}

          {/* Students */}
          {currentRow.students && currentRow.students.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  {t('classrooms.viewDialog.students')}
                </h3>
                <div className="text-muted-foreground text-sm">
                  {t('classrooms.viewDialog.studentCount', {
                    count: currentRow.students.length,
                  })}
                </div>
              </div>
            </>
          )}

          {/* Teachers */}
          {/* {currentRow.teachers && currentRow.teachers.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  {t('classrooms.viewDialog.teachers')}
                </h3>
                <div className="text-muted-foreground text-sm">
                  {t('classrooms.viewDialog.teacherCount', {
                    count: currentRow.teachers.length,
                  })}
                </div>
              </div>
            </>
          )} */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
