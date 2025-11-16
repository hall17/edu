import { useTranslation } from 'react-i18next';

import { Main } from '@/components/layout/Main';

import { SubjectsDialogs } from './components/SubjectsDialogs';
import { SubjectsTable } from './components/SubjectsTable';
import { SubjectsProvider } from './SubjectsContext';

export function SubjectsRoot() {
  const { t } = useTranslation();

  const breadcrumbItems = [
    {
      label: t('materials.subjectsCurriculums.title'),
      href: '/subjects',
    },
  ];

  return (
    <Main
      title={t('subjects.title')}
      description={t('subjects.description')}
      breadcrumbItems={breadcrumbItems}
    >
      <SubjectsProvider>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <SubjectsTable />
        </div>
        <SubjectsDialogs />
      </SubjectsProvider>
    </Main>
  );
}
