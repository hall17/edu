import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { trpc } from '@/lib/trpc';
import { Notification, NotificationStatus } from '@/types';

function useProviderValue() {
  const attendanceNotificationsQuery = useQuery(
    trpc.auth.findAttendanceNotifications.queryOptions()
  );
  const attendanceNotifications = attendanceNotificationsQuery.data ?? [];

  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const unreadCount = React.useMemo(() => {
    return notifications.filter(
      (notification) => notification.status === NotificationStatus.SENT
    ).length;
  }, [notifications]);

  const loadNotifications = React.useCallback(async () => {
    attendanceNotificationsQuery.refetch();
  }, []);

  const acknowledgeNotification = React.useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              status: NotificationStatus.ACKNOWLEDGED,
              acknowledgedAt: new Date(),
              updatedAt: new Date(),
            }
          : notification
      )
    );
  }, []);

  return {
    isOpen,
    setIsOpen,
    loadNotifications,
    attendanceNotifications,
    attendanceNotificationsQuery,
    isLoading: attendanceNotificationsQuery.isPending,
    unreadCount,
    acknowledgeNotification,
  };
}

const NotificationsContext = React.createContext<ReturnType<
  typeof useProviderValue
> | null>(null);

export function NotificationsProvider(props: React.PropsWithChildren) {
  const value = useProviderValue();

  return (
    <NotificationsContext.Provider value={value}>
      {props.children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  const notificationsContext = React.useContext(NotificationsContext);

  if (!notificationsContext) {
    throw new Error(
      'useNotificationsContext has to be used within <NotificationsContext>'
    );
  }

  return notificationsContext;
}
