import { Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { DisplayForm } from './DisplayForm';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function SettingsDisplay() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <Monitor className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {t('settings.display.title')}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t('settings.display.description')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DisplayForm />
      </CardContent>
    </Card>
  );
}
