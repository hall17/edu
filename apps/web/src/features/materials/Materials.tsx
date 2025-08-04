import { useTranslation } from 'react-i18next';

import { MaterialsDialogs } from './components/MaterialsDialogs';
import { MaterialsPrimaryButtons } from './components/MaterialsPrimaryButtons';
import { MaterialsTable } from './components/MaterialsTable';
import { MaterialsProvider } from './MaterialsContext';

import { Main } from '@/components/layout/Main';

export function Materials() {
  const { t } = useTranslation();

  return (
    <MaterialsProvider>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('materials.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('materials.description')}
            </p>
          </div>
          <MaterialsPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <MaterialsTable />
        </div>
      </Main>

      <MaterialsDialogs />
    </MaterialsProvider>
  );
}
