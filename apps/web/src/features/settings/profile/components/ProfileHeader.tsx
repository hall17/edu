import {
  IconCalendar,
  IconCamera,
  IconEdit,
  IconMail,
  IconMapPin,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/stores/authStore';

interface ProfileHeaderProps {
  onEditClick: () => void;
  isEditing: boolean;
}

export function ProfileHeader({ onEditClick, isEditing }: ProfileHeaderProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || 'U';
  };

  const formatJoinDate = (createdAt?: string | Date) => {
    if (!createdAt) return '-';
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <CardHeader>
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={user?.profilePictureUrl || undefined}
              alt={`${user?.firstName} ${user?.lastName}`}
            />
            <AvatarFallback className="text-2xl">
              {getInitials(user?.firstName, user?.lastName)}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
            >
              <IconCamera className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <h1 className="text-2xl font-bold tracking-tight">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.email || 'User'}
            </h1>
            <Badge variant="secondary">
              {t('settings.profile.status.member')}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {user?.nationalId
              ? `ID: ${user.nationalId}`
              : t('settings.profile.status.profile')}
          </p>
          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <IconMail className="size-4" />
              {user?.email || '-'}
            </div>
            <div className="flex items-center gap-1">
              <IconMapPin className="size-4" />
              {user?.city && user?.country?.name
                ? `${user.city}, ${user.country?.name}`
                : user?.country?.name || user?.city || '-'}
            </div>
            <div className="flex items-center gap-1">
              <IconCalendar className="size-4" />
              {t('settings.profile.status.joined')}{' '}
              {dayjs(user?.createdAt).format('DD/MM/YYYY')}
            </div>
          </div>
        </div>
        {!isEditing && (
          <Button variant="outline" onClick={onEditClick} className="gap-2">
            <IconEdit className="size-4" />
            {t('settings.profile.form.editProfile')}
          </Button>
        )}
      </div>
    </CardHeader>
  );
}
