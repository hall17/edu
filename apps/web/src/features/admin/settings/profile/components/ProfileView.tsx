import { User, Phone, Link as LinkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/stores/authStore';

export function ProfileView() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const formatDate = (date?: string | Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  const formatGender = (gender?: string | null) => {
    if (!gender) return '-';
    return t(`genders.${gender}` as any);
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <User className="text-primary h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold">
            {t('settings.profile.sections.personalInformation')}
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              {t('settings.profile.form.firstName')}
            </label>
            <p className="mt-1 text-sm">{user?.firstName || '-'}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              {t('settings.profile.form.lastName')}
            </label>
            <p className="mt-1 text-sm">{user?.lastName || '-'}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              {t('settings.profile.form.nationalId')}
            </label>
            <p className="mt-1 text-sm">{user?.nationalId || '-'}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              {t('settings.profile.form.dateOfBirth')}
            </label>
            <p className="mt-1 text-sm">{formatDate(user?.dateOfBirth)}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              {t('settings.profile.form.gender')}
            </label>
            <p className="mt-1 text-sm">{formatGender(user?.gender)}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              {t('settings.profile.form.email')}
            </label>
            <p className="mt-1 text-sm">{user?.email || '-'}</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <Phone className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">
            {t('settings.profile.sections.contactInformation')}
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              {t('settings.profile.form.phoneNumber')}
            </label>
            <p className="mt-1 text-sm">{user?.phoneNumber || '-'}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              {t('settings.profile.form.country')}
            </label>
            <p className="mt-1 text-sm">{user?.country?.name || '-'}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              {t('settings.profile.form.city')}
            </label>
            <p className="mt-1 text-sm">{user?.city || '-'}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              {t('settings.profile.form.zipCode')}
            </label>
            <p className="mt-1 text-sm">{user?.zipCode || '-'}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-muted-foreground text-sm font-medium">
              {t('settings.profile.form.address')}
            </label>
            <p className="mt-1 text-sm">{user?.address || '-'}</p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {(user?.facebookLink ||
        user?.twitterLink ||
        user?.instagramLink ||
        user?.linkedinLink) && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <LinkIcon className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">
              {t('settings.profile.sections.socialLinks')}
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {user?.facebookLink && (
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('settings.profile.form.facebookLink')}
                </label>
                <p className="mt-1 text-sm">
                  <a
                    href={user.facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-blue-600 hover:underline"
                  >
                    {user.facebookLink}
                  </a>
                </p>
              </div>
            )}
            {user?.twitterLink && (
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('settings.profile.form.xLink')}
                </label>
                <p className="mt-1 text-sm">
                  <a
                    href={user.twitterLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-blue-600 hover:underline"
                  >
                    {user.twitterLink}
                  </a>
                </p>
              </div>
            )}
            {user?.instagramLink && (
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('settings.profile.form.instagramLink')}
                </label>
                <p className="mt-1 text-sm">
                  <a
                    href={user.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-blue-600 hover:underline"
                  >
                    {user.instagramLink}
                  </a>
                </p>
              </div>
            )}
            {user?.linkedinLink && (
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('settings.profile.form.linkedinLink')}
                </label>
                <p className="mt-1 text-sm">
                  <a
                    href={user.linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-blue-600 hover:underline"
                  >
                    {user.linkedinLink}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
