import { Outlet } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Home } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

import { TabNav } from './TabNav';

import { useMainContext } from '@/context/MainContext';
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
  breadcrumbItems?: {
    label: string;
    href?: string;
  }[];
}

// Helper function to safely get context
function useMainContextSafe() {
  try {
    return useMainContext();
  } catch {
    return null;
  }
}

export const Main = ({
  fixed,
  className,
  title: titleProp,
  description: descriptionProp,
  children,
  extra: extraProp,
  tabItems: tabItemsProp,
  backButton: backButtonProp,
  backButtonText: backButtonTextProp,
  backButtonTo: backButtonToProp,
  onClickBackButton: onClickBackButtonProp,
  breadcrumbItems: breadcrumbItemsProp,
  ...props
}: MainProps) => {
  const { t } = useTranslation();

  // Try to get values from context, fallback to props
  const context = useMainContextSafe();
  const title = context?.title ?? titleProp;
  const description = context?.description ?? descriptionProp;
  const breadcrumbItems = context?.breadcrumbItems ?? breadcrumbItemsProp;
  const tabItems = context?.tabItems ?? tabItemsProp;
  const extra = context?.extra ?? extraProp;
  const backButton = context?.backButton ?? backButtonProp;
  const backButtonText = context?.backButtonText ?? backButtonTextProp;
  const backButtonTo = context?.backButtonTo ?? backButtonToProp;
  const onClickBackButton = context?.onClickBackButton ?? onClickBackButtonProp;
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
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <div className="mb-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Link to="/">
                    <Home className="h-4 w-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {index === breadcrumbItems.length - 1 ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : item.href ? (
                      <BreadcrumbLink
                        asChild
                        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                      >
                        <Link to={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}
      {title || description ? (
        <>
          <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
            <div className="flex items-center space-x-4">
              {/* {backButton && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  asChild
                  onClick={(e) => {
                    if (onClickBackButton) {
                      onClickBackButton();
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  <Link to={backButtonTo || '/'}>
                    <ArrowLeft />
                  </Link>
                </Button>
              )} */}
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
          {/* <Separator className="my-4 lg:my-6" /> */}
        </>
      ) : null}
      {tabItems && (
        <>
          <Separator className="mt-1" />
          <TabNav items={tabItems} />
        </>
      )}
      {children}
    </main>
  );
};

Main.displayName = 'Main';
