import { AttendanceStatus } from '@edusama/common';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useClassroomSessionForm } from '@/context/ClassroomSessionFormContext';
import { getAttendanceRecordStatusBadgeColor } from '@/utils';

export function ClassroomCalendarAttendanceRecordForm() {
  const { form, session, classroom } = useClassroomSessionForm();
  const { t } = useTranslation();

  const studentsSorted = useMemo(() => {
    return classroom?.students.sort((a, b) => {
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
  }, [classroom?.students]);

  const watchedAttendanceRecords = form.watch('attendanceRecords') ?? [];

  function handleSetAllStudentsPresent() {
    form.setValue(
      'attendanceRecords',
      studentsSorted?.map(({ student }) => {
        const existingRecord = session?.attendanceRecords?.find(
          (r) => r.studentId === student.id
        );
        return {
          ...(existingRecord ?? {}),
          studentId: student.id,
          status: AttendanceStatus.PRESENT,
          remarks: existingRecord?.remarks ?? '',
        };
      }) || []
    );
  }

  return (
    <div className="rounded-lg border">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">
              {t('classrooms.calendar.editDialog.editStudentAttendance')}
            </h4>
            <p className="text-muted-foreground text-sm">
              {t('classrooms.calendar.editDialog.selectStudentsDescription')}
            </p>
          </div>
          {!session?.isAttendanceRecordCompleted && (
            <div className="flex items-center justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSetAllStudentsPresent()}
              >
                {t('classrooms.calendar.editDialog.setAllPresent')}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {t('classrooms.calendar.editDialog.tableHeaders.studentName')}
              </TableHead>
              <TableHead>
                {t('classrooms.calendar.editDialog.tableHeaders.status')}
              </TableHead>
              <TableHead>
                {t('classrooms.calendar.editDialog.tableHeaders.remarks')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!studentsSorted || studentsSorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground text-center"
                >
                  {t('classrooms.calendar.editDialog.noStudentsEnrolled')}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {studentsSorted.map(({ student }) => {
                  const existingRecord = session?.attendanceRecords?.find(
                    (r: any) => r.studentId === student.id
                  );

                  const existingFormRecord = watchedAttendanceRecords?.find(
                    (r) => r.studentId === student.id
                  );

                  const index = watchedAttendanceRecords?.findIndex(
                    (r) => r.studentId === student.id
                  );

                  const status =
                    existingFormRecord?.status ??
                    existingRecord?.status ??
                    'none';

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
                                  existingRecord?.status
                                    ? getAttendanceRecordStatusBadgeColor(
                                        existingRecord.status
                                      )
                                    : 'outline'
                                }
                              >
                                {existingRecord?.status
                                  ? t(
                                      `attendanceStatuses.${existingRecord.status}` as any
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
                        <Select
                          value={status}
                          onValueChange={(val) => {
                            const existingAttendanceRecordIndex =
                              watchedAttendanceRecords?.findIndex(
                                (r) => r.studentId === student.id
                              );

                            if (existingAttendanceRecordIndex !== -1) {
                              form.setValue(
                                `attendanceRecords.${index}.status`,
                                val as AttendanceStatus
                              );
                            } else {
                              form.setValue(`attendanceRecords`, [
                                ...(watchedAttendanceRecords ?? []),
                                {
                                  status: val as AttendanceStatus,
                                  studentId: student.id,
                                  remarks: '',
                                },
                              ]);
                            }
                          }}
                          disabled={session?.isAttendanceRecordCompleted}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              {t('common.noRecord')}
                            </SelectItem>
                            {Object.values(AttendanceStatus).map((status) => (
                              <SelectItem key={status} value={status}>
                                {t(`attendanceStatuses.${status}` as any)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={existingFormRecord?.remarks ?? ''}
                          onChange={(e) => {
                            form.setValue(
                              `attendanceRecords.${index}.remarks`,
                              e.target.value
                            );
                          }}
                          disabled={session?.isAttendanceRecordCompleted}
                          placeholder={t(
                            'classrooms.calendar.editDialog.remarks'
                          )}
                          className="w-full"
                        />
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
  );
}
