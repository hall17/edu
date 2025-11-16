import { useNavigate, useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

export function UnauthorisedError() {
  const navigate = useNavigate();
  const { history } = useRouter();
  const { t } = useTranslation();

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">401</h1>
        <span className="font-medium">{t('errors.unauthorized.title')}</span>
        <p className="text-muted-foreground text-center">
          {t('errors.unauthorized.description')} <br />
          {t('errors.unauthorized.subtitle')}
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => history.go(-1)}>
            {t('errors.unauthorized.goBack')}
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>
            {t('errors.unauthorized.backToHome')}
          </Button>
        </div>
      </div>
    </div>
  );
}
