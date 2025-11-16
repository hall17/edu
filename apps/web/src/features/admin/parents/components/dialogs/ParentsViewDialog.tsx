import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import countries from '@/assets/countries.json';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useParentsContext } from '@/features/admin/parents/ParentsContext';
import { getStatusBadgeVariant } from '@/utils';

export function ParentsViewDialog() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog } = useParentsContext();

  const country = countries.find(
    (country) => country.iso2 === currentRow.countryCode
  );

  const shouldShowStatusUpdateInfo = currentRow.status === 'SUSPENDED';

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {t('dialogs.view.title', {
              entity: t('sidebar.navigation.parents'),
            })}
          </DialogTitle>
          <DialogDescription>{t('dialogs.view.description')}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={currentRow.profilePictureUrl || undefined}
                  alt={`${currentRow.firstName} ${currentRow.lastName}`}
                  className="object-contain"
                />
                <AvatarFallback>
                  {`${currentRow.firstName.charAt(0)}${currentRow.lastName.charAt(0)}`.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {currentRow.firstName} {currentRow.lastName}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentRow.email}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant={getStatusBadgeVariant(currentRow.status)}
                    className="capitalize"
                  >
                    {t(`userStatuses.${currentRow.status}`)}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div>
              <h4 className="mb-3 text-sm font-medium">
                {t('dialogs.view.sections.personalInformation')}
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.fullName')}
                  </label>
                  <p className="text-sm">
                    {currentRow.firstName} {currentRow.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.nationalId')}
                  </label>
                  <p className="text-sm">{currentRow.nationalId || '-'}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.gender')}
                  </label>
                  <p className="text-sm">
                    {currentRow.gender
                      ? t(`genders.${currentRow.gender}`)
                      : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.dateOfBirth')}
                  </label>
                  <p className="text-sm">
                    {currentRow.dateOfBirth
                      ? dayjs(currentRow.dateOfBirth).format('DD MMMM YYYY')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h4 className="mb-3 text-sm font-medium">
                {t('dialogs.view.sections.contactInformation')}
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.email')}
                  </label>
                  <p className="overflow-x-hidden text-sm overflow-ellipsis">
                    {currentRow.email}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.phoneNumber')}
                  </label>
                  <p className="text-sm">{currentRow.phoneNumber || '-'}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.country')}
                  </label>
                  <p className="text-sm">{country?.name || '-'}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.city')}
                  </label>
                  <p className="text-sm">{currentRow.city || '-'}</p>
                </div>
                {currentRow.state && (
                  <div>
                    <label className="text-muted-foreground text-xs font-medium">
                      {t('dialogs.view.fields.state')}
                    </label>
                    <p className="text-sm">{currentRow.state}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.address')}
                  </label>
                  <p className="text-sm">{currentRow.address || '-'}</p>
                </div>
                {currentRow.zipCode && (
                  <div>
                    <label className="text-muted-foreground text-xs font-medium">
                      {t('dialogs.view.fields.zipCode')}
                    </label>
                    <p className="text-sm">{currentRow.zipCode}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(currentRow.facebookLink ||
              currentRow.twitterLink ||
              currentRow.instagramLink ||
              currentRow.linkedinLink) && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-3 text-sm font-medium">
                    {t('dialogs.view.sections.socialLinks')}
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {currentRow.facebookLink && (
                      <div>
                        <label className="text-muted-foreground text-xs font-medium">
                          {t('dialogs.view.fields.facebookLink')}
                        </label>
                        <p className="truncate text-sm">
                          <a
                            href={currentRow.facebookLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {currentRow.facebookLink}
                          </a>
                        </p>
                      </div>
                    )}
                    {currentRow.twitterLink && (
                      <div>
                        <label className="text-muted-foreground text-xs font-medium">
                          {t('dialogs.view.fields.twitterLink')}
                        </label>
                        <p className="truncate text-sm">
                          <a
                            href={currentRow.twitterLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {currentRow.twitterLink}
                          </a>
                        </p>
                      </div>
                    )}
                    {currentRow.instagramLink && (
                      <div>
                        <label className="text-muted-foreground text-xs font-medium">
                          {t('dialogs.view.fields.instagramLink')}
                        </label>
                        <p className="truncate text-sm">
                          <a
                            href={currentRow.instagramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {currentRow.instagramLink}
                          </a>
                        </p>
                      </div>
                    )}
                    {currentRow.linkedinLink && (
                      <div>
                        <label className="text-muted-foreground text-xs font-medium">
                          {t('dialogs.view.fields.linkedinLink')}
                        </label>
                        <p className="truncate text-sm">
                          <a
                            href={currentRow.linkedinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {currentRow.linkedinLink}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* System Information */}
            <Separator />
            <div>
              <h4 className="mb-3 text-sm font-medium">
                {t('dialogs.view.sections.accountInformation')}
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.createdAt')}
                  </label>
                  <p className="text-sm">
                    {dayjs(currentRow.createdAt).format('DD/MM/YYYY')}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.lastUpdatedAt')}
                  </label>
                  <p className="text-sm">
                    {dayjs(currentRow.updatedAt).format('DD/MM/YYYY')}
                  </p>
                </div>{' '}
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.status')}
                  </label>
                  <p className="text-sm capitalize">
                    {t(`userStatuses.${currentRow.status}`)}
                  </p>
                </div>
                {shouldShowStatusUpdateInfo && currentRow.statusUpdatedAt && (
                  <div>
                    <label className="text-muted-foreground text-xs font-medium">
                      {t('dialogs.view.fields.statusUpdatedAt')}
                    </label>
                    <p className="text-sm">
                      {dayjs(currentRow.statusUpdatedAt).format('DD/MM/YYYY')}
                    </p>
                  </div>
                )}
                {shouldShowStatusUpdateInfo &&
                  currentRow.statusUpdateReason && (
                    <div className="md:col-span-2">
                      <label className="text-muted-foreground text-xs font-medium">
                        {t('dialogs.view.fields.statusUpdateReason')}
                      </label>
                      <p className="text-sm">{currentRow.statusUpdateReason}</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
