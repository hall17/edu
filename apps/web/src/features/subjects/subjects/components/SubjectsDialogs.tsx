import { useSubjectsContext } from '../SubjectsContext';

import { SubjectsActionDialog } from './SubjectsActionDialog';
import { SubjectsDeleteDialog } from './SubjectsDeleteDialog';
import { SubjectsSuspendDialog } from './SubjectsSuspendDialog';
import { SubjectsViewDialog } from './SubjectsViewDialog';

export function SubjectsDialogs() {
  const { openedDialog } = useSubjectsContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
        return <SubjectsActionDialog />;
      case 'edit':
        return <SubjectsActionDialog />;
      case 'view':
        return <SubjectsViewDialog />;
      case 'suspend':
        return <SubjectsSuspendDialog />;
      case 'delete':
        return <SubjectsDeleteDialog />;
    }
  }

  return <>{getActiveDialog()}</>;
}
