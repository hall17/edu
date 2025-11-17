import { useTranslation } from 'react-i18next';

import { AssessmentsProvider } from './AssessmentsContext';
import { AssessmentsDialogs, AssessmentsTable } from './components';

export function Assessments() {
  const { t } = useTranslation();

  return (
    <AssessmentsProvider>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <AssessmentsTable />
      </div>
      <AssessmentsDialogs />
    </AssessmentsProvider>
  );
}
