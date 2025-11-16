import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { NotificationItem } from './NotificationItem';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotificationsContext } from '@/features/shared/notifications/NotificationsContext';
import { cn } from '@/lib/utils';

export function NotificationsContent() {
  const { t } = useTranslation();
  const { attendanceNotifications, attendanceNotificationsQuery, isLoading } =
    useNotificationsContext();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h3 className="text-sm font-medium">
          {t('settings.notificationBell.notifications')}
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8"
            onClick={() => attendanceNotificationsQuery.refetch()}
            disabled={isLoading}
          >
            <RefreshCw
              className={cn(
                'h-3 w-3',
                attendanceNotificationsQuery.isPending && 'animate-spin'
              )}
            />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Content */}
      <ScrollArea className="h-96">
        {attendanceNotificationsQuery.isPending ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground text-sm">
              {t('settings.notificationBell.loadingNotifications')}
            </p>
          </div>
        ) : attendanceNotifications.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground text-sm">
              {t('settings.notificationBell.noNotifications')}
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-2">
            {attendanceNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
