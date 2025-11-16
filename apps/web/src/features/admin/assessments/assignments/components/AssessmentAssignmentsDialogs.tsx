import { useAssessmentAssignmentsContext } from '../AssessmentAssignmentsContext';

import { AssessmentAssignmentDeleteDialog } from './dialogs/AssessmentAssignmentDeleteDialog';
import { AssessmentAssignmentEditDialog } from './dialogs/AssessmentAssignmentEditDialog';
import { AssessmentAssignmentViewDialog } from './dialogs/AssessmentAssignmentViewDialog';

export function AssessmentAssignmentsDialogs() {
  const { openedDialog } = useAssessmentAssignmentsContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'view':
        return <AssessmentAssignmentViewDialog />;
      case 'edit':
        return <AssessmentAssignmentEditDialog />;
      case 'delete':
        return <AssessmentAssignmentDeleteDialog />;
      default:
        return null;
    }
  }

  return getActiveDialog();
}
