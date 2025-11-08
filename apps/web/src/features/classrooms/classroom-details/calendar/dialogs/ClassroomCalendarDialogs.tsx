import { useClassroomCalendarContext } from '../ClassroomCalendarContext';

import { ClassroomCalendarActionDialog } from './action-dialog/ClassroomCalendarActionDialog';
import { ClassroomCalendarDeleteDialog } from './ClassroomCalendarDeleteDialog';
import { ClassroomCalendarViewDialog } from './ClassroomCalendarViewDialog';

export function ClassroomCalendarDialogs() {
  const { openedDialog, showDeleteDialog } = useClassroomCalendarContext();

  return (
    <>
      {(openedDialog === 'create' || openedDialog === 'edit') && (
        <ClassroomCalendarActionDialog />
      )}
      {openedDialog === 'view' && <ClassroomCalendarViewDialog />}
      {showDeleteDialog && <ClassroomCalendarDeleteDialog />}
    </>
  );
}
