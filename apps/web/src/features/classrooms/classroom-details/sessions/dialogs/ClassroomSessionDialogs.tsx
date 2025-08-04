import { useClassroomSessionsContext } from '../ClassroomSessionsContext';

import { ClassroomSessionCreateDialog } from './ClassroomSessionCreateDialog';
import { ClassroomSessionViewDialog } from './ClassroomSessionViewDialog';

export function ClassroomSessionDialogs() {
  const { openedDialog } = useClassroomSessionsContext();

  return (
    <>
      {(openedDialog === 'create' || openedDialog === 'edit') && (
        <ClassroomSessionCreateDialog />
      )}
      {openedDialog === 'view' && <ClassroomSessionViewDialog />}
    </>
  );
}
