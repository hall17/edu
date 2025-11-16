import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { NotificationsForm } from './NotificationsForm';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function SettingsNotifications() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
            <Bell className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {t('settings.notifications.title')}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t('settings.notifications.description')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <NotificationsForm />
      </CardContent>
    </Card>
  );
}
