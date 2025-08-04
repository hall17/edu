import { IconArrowLeft } from '@tabler/icons-react';
import { Outlet } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

import { TabNav } from './TabNav';

import { cn } from '@/lib/utils';

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
  title?: string;
  description?: string;
  extra?: React.ReactNode;
  tabItems?: {
    title: string;
    icon: React.ReactNode;
    href: string;
  }[];
  backButton?: boolean;
  backButtonTo?: string;
  backButtonText?: string;
  onClickBackButton?: () => void;
}

export const Main = ({
  fixed,
  className,
  title,
  description,
  children,
  extra,
  tabItems,
  backButton,
  backButtonText,
  backButtonTo,
  onClickBackButton,
  ...props
}: MainProps) => {
  const { t } = useTranslation();
  return (
    <main
      className={cn(
        'peer-[.header-fixed]/header:mt-16',
        'px-4 py-6',
        fixed && 'fixed-main flex grow flex-col overflow-hidden',
        className
      )}
      {...props}
    >
      {title || description ? (
        <>
          <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
            <div className="flex items-center space-x-4">
              {backButton && (
                <Button
                  variant="outline"
                  asChild
                  onClick={(e) => {
                    if (onClickBackButton) {
                      onClickBackButton();
                    }
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Link to={backButtonTo || '/'}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('common.back')}
                  </Link>
                </Button>
              )}
              <div className="space-y-0.5">
                {title && (
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
            {extra}
          </div>
          <Separator className="my-4 lg:my-6" />
        </>
      ) : null}
      {tabItems ? (
        <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2">
          <aside className="top-0">
            <TabNav items={tabItems} />
          </aside>
          {children}
        </div>
      ) : (
        children
      )}
    </main>
  );
};

Main.displayName = 'Main';
