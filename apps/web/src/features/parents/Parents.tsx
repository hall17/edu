import { useTranslation } from 'react-i18next';

import {
  ParentsDialogs,
  ParentsPrimaryButtons,
  ParentsTable,
} from './components';
import { ParentsProvider } from './ParentsContext';

import { Main } from '@/components/layout/Main';

export function Parents() {
  const { t } = useTranslation();

  return (
    <ParentsProvider>
      <Main
        title={t('parents.title')}
        description={t('parents.description')}
        extra={<ParentsPrimaryButtons />}
      >
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <ParentsTable />
        </div>
      </Main>
      <ParentsDialogs />
    </ParentsProvider>
  );
}
