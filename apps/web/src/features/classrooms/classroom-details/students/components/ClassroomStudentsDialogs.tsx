import { useClassroomStudentsContext } from '../ClassroomStudentsContext';

import { ClassroomStudentsDeleteDialog } from './ClassroomStudentsDeleteDialog';
import { ClassroomStudentsEnrollmentDialog } from './ClassroomStudentsEnrollmentDialog';
import { ClassroomStudentsEnrollmentStatusDialog } from './ClassroomStudentsEnrollmentStatusDialog';
import { ClassroomStudentsViewDialog } from './ClassroomStudentsViewDialog';

export function ClassroomStudentsDialogs() {
  const { openedDialog } = useClassroomStudentsContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'enrollment':
        return <ClassroomStudentsEnrollmentDialog />;
      case 'enrollmentStatus':
        return <ClassroomStudentsEnrollmentStatusDialog />;
      case 'view':
        return <ClassroomStudentsViewDialog />;
      case 'delete':
        return <ClassroomStudentsDeleteDialog />;
      default:
        return null;
    }
  }

  return <>{getActiveDialog()}</>;
}
