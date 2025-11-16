import { useTranslation } from 'react-i18next';

import { ModulesCards } from './components/ModulesCards';
import { ModulesProvider } from './ModulesContext';

import { Main } from '@/components/layout/Main';

export function Modules() {
  const { t } = useTranslation();
  const breadcrumbItems = [
    {
      label: t('modules.title'),
      href: '/modules',
    },
  ];

  return (
    <ModulesProvider>
      <Main
        title={t('modules.title')}
        description={t('modules.description')}
        breadcrumbItems={breadcrumbItems}
      >
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <ModulesCards />
        </div>
      </Main>
    </ModulesProvider>
  );
}
