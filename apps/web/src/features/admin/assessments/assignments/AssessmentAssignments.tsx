import { useTranslation } from 'react-i18next';

import { AssessmentAssignmentsProvider } from './AssessmentAssignmentsContext';
import { AssessmentAssignmentsDialogs } from './components/AssessmentAssignmentsDialogs';
import { AssessmentAssignmentsTable } from './components/AssessmentAssignmentsTable';

export function AssessmentAssignments() {
  return (
    <AssessmentAssignmentsProvider>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <AssessmentAssignmentsTable />
      </div>
      <AssessmentAssignmentsDialogs />
    </AssessmentAssignmentsProvider>
  );
}
