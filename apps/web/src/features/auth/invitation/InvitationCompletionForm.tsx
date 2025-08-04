import { UserType } from '@edusama/common';
import { IconCircleCheck } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';

export function InvitationCompletionForm({
  signedUpUserType,
}: {
  signedUpUserType: UserType;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <IconCircleCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-green-700 dark:text-green-400">
          {t('auth.invitation.form.awaitingApproval.title')}
        </CardTitle>
        <CardDescription className="text-center">
          {t('auth.invitation.form.awaitingApproval.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        {signedUpUserType === 'student' && (
          <>
            <p className="text-muted-foreground">
              {t('auth.invitation.form.awaitingApproval.message')}
            </p>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {t('auth.invitation.form.awaitingApproval.note')}
              </p>
            </div>
          </>
        )}
        <Button onClick={() => navigate({ to: '/' })} className="w-full">
          {signedUpUserType === 'student'
            ? t('common.returnToHomepage')
            : t('common.clickHereToLogin')}
        </Button>
      </CardContent>
    </Card>
  );
}
