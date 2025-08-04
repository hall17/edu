import dayjs from 'dayjs';
import { AlertTriangle, Calendar, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { LoadingButton } from '@/components/LoadingButton';
import { Badge } from '@/components/ui/badge';
import { useNotificationsContext } from '@/features/notifications/NotificationsContext';
import { AttendanceNotification } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface Props {
  notification: AttendanceNotification;
}

export function NotificationItem({ notification }: Props) {
  const { acknowledgeNotification } = useNotificationsContext();
  const { t } = useTranslation();

  const handleAcknowledge = () => {
    acknowledgeNotification(notification.id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ATTENDANCE_VIOLATION':
        return <AlertTriangle className="text-destructive h-4 w-4" />;
      case 'REMINDER':
      case 'WEEKLY_SUMMARY':
      case 'MONTHLY_SUMMARY':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'ATTENDANCE_VIOLATION':
        return t('attendanceNotificationTypes.ATTENDANCE_VIOLATION');
      case 'REMINDER':
        return t('attendanceNotificationTypes.REMINDER');
      case 'WEEKLY_SUMMARY':
        return t('attendanceNotificationTypes.WEEKLY_SUMMARY');
      case 'MONTHLY_SUMMARY':
        return t('attendanceNotificationTypes.MONTHLY_SUMMARY');
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return (
          <Badge variant="secondary" className="text-xs">
            {t('settings.notificationBell.sent')}
          </Badge>
        );
      case 'ACKNOWLEDGED':
        return (
          <Badge variant="outline" className="text-xs">
            {t('settings.notificationBell.acknowledged')}
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="outline" className="text-xs">
            Pending
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="destructive" className="text-xs">
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const title =
    notification.classroomIntegration?.classroom?.name || 'Notification';
  const message = `${notification.classroomIntegration?.subject?.name || 'Subject'} - ${getNotificationTypeLabel(notification.notificationType)}`;

  return (
    <div
      className={cn(
        'hover:bg-muted/50 flex flex-col space-y-2 rounded-lg border p-3 transition-colors',
        notification.status === 'ACKNOWLEDGED' && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2">
          {getNotificationIcon(notification.notificationType)}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="truncate text-sm font-medium">{title}</h4>
              {getStatusBadge(notification.status)}
            </div>
            <p className="text-muted-foreground mt-1 text-sm">{message}</p>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground flex flex-col justify-between space-y-1 text-xs">
        <span>
          {t('settings.notificationBell.notificationDate')}:{' '}
          {dayjs(notification.notificationDate).format('DD/MM/YYYY HH:mm')}
        </span>
        {notification.acknowledgedAt && (
          <span>
            {t('settings.notificationBell.acknowledgedAt')}:{' '}
            {dayjs(notification.acknowledgedAt).format('DD/MM/YYYY HH:mm')}
          </span>
        )}
      </div>

      {notification.status === 'SENT' && (
        <div className="flex justify-end">
          <LoadingButton
            variant="outline"
            size="sm"
            onClick={handleAcknowledge}
            className="h-7 px-2 text-xs"
            // isLoading={isLoading}
          >
            <Check className="mr-1 h-3 w-3" />
            {t('settings.notificationBell.acknowledge')}
          </LoadingButton>
        </div>
      )}
    </div>
  );
}
