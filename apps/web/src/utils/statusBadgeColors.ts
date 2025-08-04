import { Badge } from '@/components/ui/badge';
import {
  AttendanceRecord,
  ClassroomStudent,
  Module,
  Student,
  Subject,
  User,
} from '@/lib/trpc';

export function getStatusBadgeVariant(
  status:
    | Student['status']
    | User['status']
    | Subject['status']
    | ClassroomStudent['status']
    | Module['status']
): React.ComponentProps<typeof Badge>['variant'] {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'SUSPENDED':
      return 'secondary';
    case 'TERMINATED':
      return 'error';
    case 'INVITED':
      return 'default';
    case 'REQUESTED_APPROVAL':
      return 'warning';
    case 'REQUESTED_CHANGES':
      return 'warning';
    case 'REJECTED':
      return 'error';
    case 'ENROLLED':
      return 'success';
    case 'WITHDRAWN':
      return 'secondary';
    case 'COMPLETED':
      return 'default';
    case 'INACTIVE':
      return 'secondary';
    case 'DELETED':
      return 'error';
  }
}

export function getAttendanceRecordStatusBadgeColor(
  status: AttendanceRecord['status']
) {
  switch (status) {
    case 'PRESENT':
      return 'success';
    case 'ABSENT':
      return 'error';
    case 'PARTIAL':
      return 'warning';
    case 'LATE':
      return 'warning';
    case 'EXCUSED':
      return 'secondary';
  }
}
