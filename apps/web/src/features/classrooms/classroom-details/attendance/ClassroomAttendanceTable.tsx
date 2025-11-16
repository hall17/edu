import React from 'react';

import { useClassroomAttendanceContext } from './ClassroomAttendanceContext';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type AttendanceStatusType =
  | 'PRESENT'
  | 'ABSENT'
  | 'PARTIAL'
  | 'LATE'
  | 'EXCUSED';

interface DayAttendance {
  day: number;
  sessionId?: string;
  status?: AttendanceStatusType;
  isRecordCompleted: boolean;
}

interface StudentAttendanceRow {
  studentId: string;
  studentName: string;
  days: DayAttendance[];
}

function getAttendanceDotColor(
  status?: AttendanceStatusType,
  isRecordCompleted?: boolean
): string {
  if (!isRecordCompleted) {
    return 'bg-gray-400'; // Gray for not completed
  }

  switch (status) {
    case 'PRESENT':
      return 'bg-green-500';
    case 'ABSENT':
      return 'bg-red-500';
    case 'PARTIAL':
      return 'bg-yellow-500';
    case 'LATE':
      return 'bg-orange-500';
    case 'EXCUSED':
      return 'bg-blue-500';
    default:
      return 'bg-gray-400'; // Gray for no record
  }
}

function getAttendanceStatusLabel(
  status?: AttendanceStatusType,
  isRecordCompleted?: boolean
): string {
  if (!isRecordCompleted) {
    return 'Not Completed';
  }

  switch (status) {
    case 'PRESENT':
      return 'Present';
    case 'ABSENT':
      return 'Absent';
    case 'PARTIAL':
      return 'Partial';
    case 'LATE':
      return 'Late';
    case 'EXCUSED':
      return 'Excused';
    default:
      return 'No Record';
  }
}

export function ClassroomAttendanceTable() {
  const {
    classroomIntegrationSessions,
    classroom,
    selectedMonth,
    selectedYear,
  } = useClassroomAttendanceContext();

  // Calculate attendance data
  const attendanceData = React.useMemo((): StudentAttendanceRow[] => {
    const students = classroom?.students || [];

    // Get the number of days in the selected month
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    // Create a map of sessions by day
    const sessionsByDay = new Map<
      number,
      (typeof classroomIntegrationSessions)[0]
    >();

    classroomIntegrationSessions.forEach((session) => {
      const sessionDate = new Date(session.startDate);
      const day = sessionDate.getDate();

      // Only include sessions from the selected month/year
      if (
        sessionDate.getMonth() + 1 === selectedMonth &&
        sessionDate.getFullYear() === selectedYear
      ) {
        // If there are multiple sessions on the same day, keep the latest one
        if (
          !sessionsByDay.has(day) ||
          new Date(session.startDate) >
            new Date(sessionsByDay.get(day)!.startDate)
        ) {
          sessionsByDay.set(day, session);
        }
      }
    });

    // Build attendance rows for each student
    return students.map((classroomStudent) => {
      const days: DayAttendance[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const session = sessionsByDay.get(day);

        if (session) {
          const attendanceRecord = session.attendanceRecords?.find(
            (record) => record.studentId === classroomStudent.studentId
          );

          days.push({
            day,
            sessionId: session.id,
            status: attendanceRecord?.status as
              | AttendanceStatusType
              | undefined,
            isRecordCompleted: session.isAttendanceRecordCompleted,
          });
        } else {
          // No session on this day
          days.push({
            day,
            isRecordCompleted: false,
          });
        }
      }

      return {
        studentId: classroomStudent.studentId,
        studentName: `${classroomStudent.student.firstName} ${classroomStudent.student.lastName}`,
        days,
      };
    });
  }, [
    classroomIntegrationSessions,
    classroom?.students,
    selectedMonth,
    selectedYear,
  ]);

  // Get the number of days in the selected month
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const dayHeaders = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (attendanceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">
            No students enrolled in this classroom
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Table</CardTitle>
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span>Late</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span>Excused</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-400" />
            <span>Not Completed / No Session</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-background sticky left-0 z-10 min-w-[200px]">
                  Student Name
                </TableHead>
                {dayHeaders.map((day) => (
                  <TableHead key={day} className="text-center">
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((studentRow) => (
                <TableRow key={studentRow.studentId}>
                  <TableCell className="bg-background sticky left-0 z-10 font-medium">
                    {studentRow.studentName}
                  </TableCell>
                  {studentRow.days.map((dayAttendance) => (
                    <TableCell key={dayAttendance.day} className="text-center">
                      {dayAttendance.sessionId && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-center">
                                <div
                                  className={`h-3 w-3 rounded-full ${getAttendanceDotColor(
                                    dayAttendance.status,
                                    dayAttendance.isRecordCompleted
                                  )}`}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Day {dayAttendance.day}:{' '}
                                {getAttendanceStatusLabel(
                                  dayAttendance.status,
                                  dayAttendance.isRecordCompleted
                                )}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
