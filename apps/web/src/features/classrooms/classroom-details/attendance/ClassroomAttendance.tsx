import { ClassroomAttendanceChart } from './ClassroomAttendanceChart';
import {
  ClassroomAttendanceProvider,
  useClassroomAttendanceContext,
} from './ClassroomAttendanceContext';
import { ClassroomAttendanceTable } from './ClassroomAttendanceTable';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function ClassroomAttendanceContent() {
  const {
    classroom,
    selectedIntegrationId,
    setSelectedIntegrationId,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
  } = useClassroomAttendanceContext();

  const integrations = classroom?.integrations || [];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Integration Select */}
        <div className="space-y-2">
          <Label>Lesson Plan</Label>
          <Select
            value={selectedIntegrationId}
            onValueChange={setSelectedIntegrationId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select lesson plan" />
            </SelectTrigger>
            <SelectContent>
              {integrations.map((integration, index) => (
                <SelectItem key={integration.id} value={integration.id}>
                  {integration.subject?.name || `Lesson Plan ${index + 1}`}
                  {integration.teacher &&
                    ` - ${integration.teacher.firstName} ${integration.teacher.lastName}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month Select */}
        <div className="space-y-2">
          <Label>Month</Label>
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(Number(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Select */}
        <div className="space-y-2">
          <Label>Year</Label>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Attendance Table */}
      <ClassroomAttendanceTable />
    </div>
  );
}

export function ClassroomAttendance() {
  return (
    <ClassroomAttendanceProvider>
      <ClassroomAttendanceContent />
    </ClassroomAttendanceProvider>
  );
}
