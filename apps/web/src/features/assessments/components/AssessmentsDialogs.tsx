import { useAssessmentsContext } from '../AssessmentsContext';

import { AssessmentClassroomAssignmentDialog } from './AssessmentClassroomAssignmentDialog';
import { AssessmentActionDialog } from './dialogs/action-dialog/AssessmentActionDialog';
import { AssessmentDeleteDialog } from './dialogs/AssessmentDeleteDialog';
import { AssessmentSuspendDialog } from './dialogs/AssessmentSuspendDialog';
import { AssessmentViewDialog } from './dialogs/AssessmentViewDialog';

export function AssessmentsDialogs() {
  const { openedDialog } = useAssessmentsContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'view':
        return <AssessmentViewDialog />;
      case 'add':
      case 'edit':
        return <AssessmentActionDialog />;
      case 'suspend':
        return <AssessmentSuspendDialog />;
      case 'delete':
        return <AssessmentDeleteDialog />;
      case 'assignToClassroom':
        return <AssessmentClassroomAssignmentDialog />;
      default:
        return null;
    }
  }

  return getActiveDialog();
}
