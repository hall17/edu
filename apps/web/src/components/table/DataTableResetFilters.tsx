import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

interface DataTableResetFiltersProps {
  onClick: () => void;
}

export function DataTableResetFilters({ onClick }: DataTableResetFiltersProps) {
  const { t } = useTranslation();

  return (
    <Button variant="ghost" onClick={onClick} className="h-8 px-2 lg:px-3">
      {t('table.actions.clearFilters')}
      <X className="ml-2 h-4 w-4" />
    </Button>
  );
}
