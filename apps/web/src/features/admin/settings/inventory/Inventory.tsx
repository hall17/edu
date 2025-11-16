import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { InventoryTable } from './components';
import { InventoryProvider } from './context/InventoryContext';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function SettingsInventory() {
  const { t } = useTranslation();

  return (
    <InventoryProvider>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {t('settings.inventory.title')}
              </h2>
              <p className="text-muted-foreground text-sm">
                {t('settings.inventory.description')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {t('settings.inventory.deviceAssignments')}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('settings.inventory.deviceAssignmentsDescription')}
              </p>
            </div>
          </div>
          <div className="overflow-auto">
            <InventoryTable />
          </div>
        </CardContent>
      </Card>
    </InventoryProvider>
  );
}
