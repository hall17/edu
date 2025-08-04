import { useTranslation } from 'react-i18next';

import { AssessmentsProvider } from './AssessmentsContext';
import {
  AssessmentsDialogs,
  AssessmentsPrimaryButtons,
  AssessmentsTable,
} from './components';

import { Main } from '@/components/layout/Main';

export function Assessments() {
  const { t } = useTranslation();

  return (
    <AssessmentsProvider>
      <Main
        title={t('assessments.title')}
        description={t('assessments.description')}
        extra={<AssessmentsPrimaryButtons />}
      >
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <AssessmentsTable />
        </div>
      </Main>

      <AssessmentsDialogs />
    </AssessmentsProvider>
  );
}
