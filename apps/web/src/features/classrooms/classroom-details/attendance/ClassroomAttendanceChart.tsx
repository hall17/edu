import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useClassroomAttendanceContext } from './ClassroomAttendanceContext';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ClassroomAttendanceChart() {
  const { classroomIntegrationSessions, classroom } =
    useClassroomAttendanceContext();
  console.log('classroomIntegrationSessions', classroomIntegrationSessions);
  console.log('classroom', classroom);
  // Calculate attendance summaries from session data
  const chartData = React.useMemo(() => {
    const studentAttendanceMap = new Map<
      string,
      {
        name: string;
        present: number;
        absent: number;
        partial: number;
        late: number;
        excused: number;
      }
    >();

    classroomIntegrationSessions.forEach((session) => {
      classroom?.students?.forEach((student) => {
        const record = session.attendanceRecords?.find(
          (r) => r.studentId === student.studentId
        );
        const studentKey = student.studentId;
        const studentName = `${student.student.firstName} ${student.student.lastName}`;

        if (!studentAttendanceMap.has(studentKey)) {
          studentAttendanceMap.set(studentKey, {
            name: studentName,
            present: 0,
            absent: 0,
            partial: 0,
            late: 0,
            excused: 0,
          });
        }

        const studentData = studentAttendanceMap.get(studentKey)!;

        if (!record) {
          studentData.present++;
        } else {
          switch (record?.status) {
            case 'PRESENT':
              studentData.present++;
              break;
            case 'ABSENT':
              studentData.absent++;
              break;
            case 'PARTIAL':
              studentData.partial++;
              break;
            case 'LATE':
              studentData.late++;
              break;
            case 'EXCUSED':
              studentData.excused++;
              break;
          }
        }
      });
    });

    return Array.from(studentAttendanceMap.values());
  }, [classroomIntegrationSessions, classroom]);

  console.log('chartData', chartData);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No attendance data available for the selected period.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar
              dataKey="present"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
              name="Present"
              stackId="a"
            />
            <Bar
              dataKey="late"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
              name="Late"
              stackId="a"
            />
            <Bar
              dataKey="partial"
              fill="hsl(var(--chart-3))"
              radius={[4, 4, 0, 0]}
              name="Partial"
              stackId="a"
            />
            <Bar
              dataKey="excused"
              fill="hsl(var(--chart-4))"
              radius={[4, 4, 0, 0]}
              name="Excused"
              stackId="a"
            />
            <Bar
              dataKey="absent"
              fill="hsl(var(--chart-5))"
              radius={[4, 4, 0, 0]}
              name="Absent"
              stackId="a"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
