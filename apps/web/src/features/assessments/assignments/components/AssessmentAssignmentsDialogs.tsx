import { useAssessmentAssignmentsContext } from '../AssessmentAssignmentsContext';

import { AssessmentAssignmentViewDialog } from './dialogs/AssessmentAssignmentViewDialog';
import { AssessmentAssignmentEditDialog } from './dialogs/AssessmentAssignmentEditDialog';
import { AssessmentAssignmentDeleteDialog } from './dialogs/AssessmentAssignmentDeleteDialog';

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
