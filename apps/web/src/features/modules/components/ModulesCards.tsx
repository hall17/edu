import { useTranslation } from 'react-i18next';

import { useModulesContext } from '../ModulesContext';

import { ModuleCard } from './ModuleCard';

export function ModulesCards() {
  const { t } = useTranslation();
  const { modulesQuery } = useModulesContext();

  if (modulesQuery.isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-muted h-24 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (modulesQuery.isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">{t('modules.cards.loadError')}</p>
      </div>
    );
  }

  const modules = modulesQuery.data?.modules ?? [];

  if (modules.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">{t('modules.cards.noModules')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 space-y-4 gap-x-3 lg:grid-cols-2">
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </div>
  );
}
