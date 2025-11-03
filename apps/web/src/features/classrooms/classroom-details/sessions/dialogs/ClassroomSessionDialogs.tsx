import { useClassroomSessionsContext } from '../ClassroomSessionsContext';

import { ClassroomSessionActionDialog } from './action-dialog/ClassroomSessionActionDialog';
import { ClassroomSessionDeleteDialog } from './ClassroomSessionDeleteDialog';
import { ClassroomSessionViewDialog } from './ClassroomSessionViewDialog';

export function ClassroomSessionDialogs() {
  const { openedDialog, showDeleteDialog } = useClassroomSessionsContext();

  return (
    <>
      {(openedDialog === 'create' || openedDialog === 'edit') && (
        <ClassroomSessionActionDialog />
      )}
      {openedDialog === 'view' && <ClassroomSessionViewDialog />}
      {showDeleteDialog && <ClassroomSessionDeleteDialog />}
    </>
  );
}
