import { Bell } from 'lucide-react';
import React from 'react';

import { NotificationsContent } from './NotificationsContent';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotificationsContext } from '@/features/shared/notifications/NotificationsContext';

export function NotificationBell() {
  const { isOpen, setIsOpen, unreadCount, loadNotifications } =
    useNotificationsContext();

  React.useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <NotificationsContent />
      </PopoverContent>
    </Popover>
  );
}
