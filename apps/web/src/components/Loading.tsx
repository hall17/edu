import { useTranslation } from 'react-i18next';

import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export function Loading(props: React.ComponentProps<'div'>) {
  const { t } = useTranslation();

  return (
    <div
      {...props}
      className={cn(
        'flex w-full items-center justify-center p-4',
        props.className
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <Spinner className="text-primary size-12" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-foreground text-lg font-medium">
            {t('common.loading')}
          </p>
          <p className="text-muted-foreground text-sm">
            {t('common.loadingContent')}
          </p>
        </div>
      </div>
    </div>
  );
}
