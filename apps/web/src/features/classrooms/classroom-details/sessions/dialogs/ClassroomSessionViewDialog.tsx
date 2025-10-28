import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { useClassroomDetailsContext } from '../../ClassroomDetailsContext';
import { useClassroomSessionsContext } from '../ClassroomSessionsContext';

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

export function ClassroomSessionViewDialog() {
  const { openedDialog, setOpenedDialog, currentRow, setShowDeleteDialog } =
    useClassroomSessionsContext();
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
      onOpenChange={() => setOpenedDialog(null)}
    >
      <DialogContent className="min-w-[80vw]">
        <DialogHeader>
          <DialogTitle>{t('sessions.viewDialog.title')}</DialogTitle>
          <DialogDescription>
            {dayjs(currentRow.startDate).format('DD/MM/YYYY HH:mm')} -{' '}
            {dayjs(currentRow.endDate).format('HH:mm')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Information Section */}
          <div className="rounded-lg border p-4">
            <h4 className="mb-4 font-medium">
              {t('sessions.viewDialog.sessionInformation')}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('sessions.viewDialog.classroomIntegrationLabel')}
                </label>
                <p className="mt-1">
                  {selectedClassroomIntegration?.subject?.name} -{' '}
                  {selectedClassroomIntegration?.curriculum?.name}
                </p>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('sessions.viewDialog.teacherLabel')}
                </label>
                <p className="mt-1">
                  {currentRow.teacher
                    ? `${currentRow.teacher.firstName} ${currentRow.teacher.lastName}`
                    : '-'}
                </p>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('sessions.viewDialog.lessonLabel')}
                </label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {currentRow.lessons?.map((lessonRelation: any) => (
                    <Badge key={lessonRelation.lesson.id} variant="secondary">
                      {lessonRelation.lesson.name}
                    </Badge>
                  ))}
                  {!currentRow.lessons?.length && (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('sessions.viewDialog.descriptionLabel')}
                </label>
                <p className="mt-1">
                  {currentRow.description || (
                    <span className="text-muted-foreground">-</span>
                  )}
                </p>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('sessions.viewDialog.startDateLabel')}
                </label>
                <p className="mt-1">
                  {dayjs(currentRow.startDate).format('DD/MM/YYYY HH:mm')}
                </p>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('sessions.viewDialog.endDateLabel')}
                </label>
                <p className="mt-1">
                  {dayjs(currentRow.endDate).format('DD/MM/YYYY HH:mm')}
                </p>
              </div>
            </div>
          </div>

          {/* Attendance Section */}
          <div className="rounded-lg border">
            <div className="border-b p-4">
              <h4 className="font-medium">
                {t('classrooms.sessions.editDialog.editStudentAttendance')}
              </h4>
              <p className="text-muted-foreground text-sm">
                {t('classrooms.sessions.editDialog.selectStudentsDescription')}
              </p>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {t(
                        'classrooms.sessions.editDialog.tableHeaders.studentName'
                      )}
                    </TableHead>
                    <TableHead>
                      {t('classrooms.sessions.editDialog.tableHeaders.status')}
                    </TableHead>
                    <TableHead>
                      {t('classrooms.sessions.editDialog.tableHeaders.remarks')}
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
                        {t('classrooms.sessions.editDialog.noStudentsEnrolled')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {studentsSorted.map(({ student }) => {
                        const attendanceRecord =
                          currentRow.attendanceRecords?.find(
                            (r: any) => r.studentId === student.id
                          );

                        return (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">
                                      {student.firstName} {student.lastName}
                                    </p>
                                    <Badge
                                      className="text-xs"
                                      variant={
                                        attendanceRecord?.status
                                          ? getAttendanceRecordStatusBadgeColor(
                                              attendanceRecord.status
                                            )
                                          : 'outline'
                                      }
                                    >
                                      {attendanceRecord?.status
                                        ? t(
                                            `attendanceStatuses.${attendanceRecord.status}` as any
                                          )
                                        : t('common.noRecord')}
                                    </Badge>
                                  </div>
                                  <p className="text-muted-foreground text-sm">
                                    {student.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  attendanceRecord?.status
                                    ? getAttendanceRecordStatusBadgeColor(
                                        attendanceRecord.status
                                      )
                                    : 'outline'
                                }
                              >
                                {attendanceRecord?.status
                                  ? t(
                                      `attendanceStatuses.${attendanceRecord.status}` as any
                                    )
                                  : t('common.noRecord')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p>
                                {attendanceRecord?.remarks || (
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </p>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenedDialog(null)}
          >
            {t('common.close')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            {t('common.delete')}
          </Button>
          <Button type="button" onClick={() => setOpenedDialog('edit')}>
            {t('common.edit')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
