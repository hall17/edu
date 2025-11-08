import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  Building2,
  Calendar,
  MapPin,
  Phone,
  Users,
  Pencil,
  Image as ImageIcon,
  Settings,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/stores/authStore';

interface BranchSettingsViewProps {
  onEditClick: () => void;
}

export function BranchSettingsView({ onEditClick }: BranchSettingsViewProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: branch, isLoading } = useQuery(
    trpc.branch.findOne.queryOptions(
      {
        id: user?.activeBranchId ?? 0,
      },
      {
        enabled: !!user?.activeBranchId,
      }
    )
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="bg-muted h-32 animate-pulse rounded-lg" />
            <div className="bg-muted h-32 animate-pulse rounded-lg" />
            <div className="bg-muted h-32 animate-pulse rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!branch) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              {t('branchSettings.noBranchFound')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {t('branchSettings.title')}
            </h1>
            <p className="text-muted-foreground text-base">
              {t('branchSettings.description')}
            </p>
          </div>
          <Button onClick={onEditClick} variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            {t('common.edit')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Building2 className="text-primary h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">
              {t('branchSettings.sections.basicInformation')}
            </h3>
          </div>

          {/* Logo Section */}
          <div className="flex justify-center">
            <div className="relative">
              {branch.logoUrl ? (
                <img
                  src={branch.logoUrl}
                  alt={t('branchSettings.form.logo')}
                  className="border-border bg-background size-[88px] rounded-xl border-2 object-cover shadow-sm"
                />
              ) : (
                <div className="border-border bg-muted flex size-[88px] items-center justify-center rounded-xl border-2 border-dashed">
                  <ImageIcon className="text-muted-foreground h-12 w-12" />
                </div>
              )}
              <div className="bg-background border-border absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full border-2">
                <ImageIcon className="text-muted-foreground h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="text-muted-foreground h-4 w-4" />
                <label className="text-muted-foreground text-sm font-medium">
                  {t('branchSettings.form.name')}
                </label>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <p className="font-medium">{branch.name || '-'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Settings className="text-muted-foreground h-4 w-4" />
                <label className="text-muted-foreground text-sm font-medium">
                  {t('branchSettings.form.slug')}
                </label>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <p className="font-medium">{branch.slug || '-'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="text-muted-foreground h-4 w-4" />
              <label className="text-muted-foreground text-sm font-medium">
                {t('branchSettings.form.maximumStudents')}
              </label>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <p className="font-medium">{branch.maximumStudents || '-'}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">
              {t('branchSettings.sections.contactInformation')}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="text-muted-foreground h-4 w-4" />
                <label className="text-muted-foreground text-sm font-medium">
                  {t('branchSettings.form.location')}
                </label>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <p className="font-medium">{branch.location || '-'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="text-muted-foreground h-4 w-4" />
                <label className="text-muted-foreground text-sm font-medium">
                  {t('branchSettings.form.contact')}
                </label>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <p className="font-medium">{branch.contact || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* System Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">
              {t('branchSettings.sections.systemInformation')}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="text-muted-foreground h-4 w-4" />
                <label className="text-muted-foreground text-sm font-medium">
                  {t('branchSettings.form.company')}
                </label>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <p className="font-medium">{branch.company?.name || '-'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <label className="text-muted-foreground text-sm font-medium">
                  {t('branchSettings.form.createdAt')}
                </label>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <p className="font-medium">
                  {dayjs(branch.createdAt).format('DD/MM/YYYY')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
