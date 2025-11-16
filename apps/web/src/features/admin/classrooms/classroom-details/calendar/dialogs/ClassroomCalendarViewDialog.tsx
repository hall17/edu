import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { useClassroomDetailsContext } from '../../ClassroomDetailsContext';
import { useClassroomCalendarContext } from '../ClassroomCalendarContext';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAttendanceRecordStatusBadgeColor } from '@/utils';

export function ClassroomCalendarViewDialog() {
  const { openedDialog, setOpenedDialog, currentRow, setShowDeleteDialog } =
    useClassroomCalendarContext();
  const { classroom } = useClassroomDetailsContext();
  const { t } = useTranslation();

  if (openedDialog !== 'view' || !currentRow) return null;

  const selectedClassroomIntegration = classroom?.integrations.find(
    (ci) => ci.id === currentRow.classroomIntegrationId
  );
  const studentsSorted = classroom?.students?.sort((a, b) => {
    // First sort by firstName
    const firstNameComparison = a.student.firstName.localeCompare(
      b.student.firstName
    );
    if (firstNameComparison !== 0) {
      return firstNameComparison;
    }
    // If firstNames are equal, sort by lastName
    return a.student.lastName.localeCompare(b.student.lastName);
  });

  return (
    <Dialog
      open={openedDialog === 'view'}
      onOpenChange={(open) => {
        if (!open) {
          setOpenedDialog(null);
        }
      }}
    >
      <DialogContent className="min-w-[80vw]">
        <DialogHeader>
          <DialogTitle>{t('classrooms.calendar.viewDialog.title')}</DialogTitle>
          <DialogDescription>
            {currentRow.startDate && currentRow.endDate && (
              <>
                {dayjs(currentRow.startDate).format('DD/MM/YYYY HH:mm')} -{' '}
                {dayjs(currentRow.endDate).format('HH:mm')}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Information */}
          <div className="rounded-lg border p-4">
            <h4 className="mb-4 font-medium">
              {t('classrooms.calendar.viewDialog.sessionInformation')}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t(
                    'classrooms.calendar.viewDialog.classroomIntegrationLabel'
                  )}
                </label>
                <p className="mt-1">
                  {selectedClassroomIntegration?.subject?.name}
                </p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.calendar.viewDialog.teacherLabel')}
                </label>
                <p className="mt-1">
                  {currentRow.teacher?.firstName} {currentRow.teacher?.lastName}
                </p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.calendar.viewDialog.lessonLabel')}
                </label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {currentRow.lessons?.length ? (
                    currentRow.lessons.map((lessonItem) => (
                      <Badge key={lessonItem.lesson.id} variant="outline">
                        {lessonItem.lesson.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.calendar.viewDialog.descriptionLabel')}
                </label>
                <p className="mt-1">{currentRow.description || '—'}</p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.calendar.viewDialog.startDateLabel')}
                </label>
                <p className="mt-1">
                  {dayjs(currentRow.startDate).format('DD/MM/YYYY HH:mm')}
                </p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('classrooms.calendar.viewDialog.endDateLabel')}
                </label>
                <p className="mt-1">
                  {dayjs(currentRow.endDate).format('DD/MM/YYYY HH:mm')}
                </p>
              </div>
            </div>
          </div>

          {/* Enrolled Students */}
          <div className="rounded-lg border">
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  {t('classrooms.calendar.viewDialog.enrolledStudents')}
                </h4>
                <Badge variant="outline">
                  {t('classrooms.calendar.viewDialog.totalLabel')}{' '}
                  {studentsSorted?.length || 0}
                </Badge>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {t('classrooms.calendar.viewDialog.studentName')}
                    </TableHead>
                    <TableHead>
                      {t('classrooms.calendar.viewDialog.status')}
                    </TableHead>
                    <TableHead>
                      {t('classrooms.calendar.viewDialog.remarks')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!studentsSorted || studentsSorted.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-muted-foreground text-center"
                      >
                        {t(
                          'classrooms.calendar.viewDialog.noAttendanceRecordsFound'
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    studentsSorted.map(({ student }) => {
                      const attendanceRecord =
                        currentRow.attendanceRecords?.find(
                          (record) => record.studentId === student.id
                        );

                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {student.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {attendanceRecord ? (
                              <Badge
                                variant={getAttendanceRecordStatusBadgeColor(
                                  attendanceRecord.status
                                )}
                              >
                                {t(
                                  `attendanceStatuses.${attendanceRecord.status}` as any
                                )}
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                {t('common.noRecord')}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {attendanceRecord?.remarks || '—'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive hover:text-destructive"
          >
            {t('common.delete')}
          </Button>
          <Button variant="outline" onClick={() => setOpenedDialog('edit')}>
            {t('common.edit')}
          </Button>
          <Button
            onClick={() => {
              setOpenedDialog(null);
            }}
          >
            {t('common.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
