import { useTranslation } from 'react-i18next';

import { AssessmentAssignmentsProvider } from './AssessmentAssignmentsContext';
import { AssessmentAssignmentsTable } from './components/AssessmentAssignmentsTable';
import { AssessmentAssignmentsDialogs } from './components/AssessmentAssignmentsDialogs';

export function AssessmentAssignments() {
  const { t } = useTranslation();

  return (
    <AssessmentAssignmentsProvider>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <AssessmentAssignmentsTable />
      </div>
      <AssessmentAssignmentsDialogs />
    </AssessmentAssignmentsProvider>
  );
}
