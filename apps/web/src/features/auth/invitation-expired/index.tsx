import { useNavigate } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AuthLayout } from '../AuthLayout';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export function InvitationExpired() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <AuthLayout className="min-w-[100vw] md:min-w-[50vw]">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-700 dark:text-red-400">
            {t('auth.invitation.expired.title')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.invitation.expired.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            {t('auth.invitation.expired.message')}
          </p>
          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
              {t('auth.invitation.expired.contactNote')}
            </p>
          </div>
          <Button onClick={() => navigate({ to: '/' })} className="w-full">
            {t('common.returnToHomepage')}
          </Button>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
