import { Outlet } from '@tanstack/react-router';
import { Building2, GitBranch } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Main } from '@/components/layout/Main';

export function CompaniesAndBranches() {
  const { t } = useTranslation();

  const breadcrumbItems = [
    {
      label: t('companiesAndBranches.title'),
      href: '/companies/branches',
    },
  ];

  const sidebarNavItems = [
    {
      title: t('companiesAndBranches.tabs.companies'),
      icon: <Building2 size={18} />,
      href: '/companies',
    },
    {
      title: t('companiesAndBranches.tabs.branches'),
      icon: <GitBranch size={18} />,
      href: '/companies/branches',
    },
  ];

  return (
    <Main
      title={t('companiesAndBranches.title')}
      description={t('companiesAndBranches.description')}
      breadcrumbItems={breadcrumbItems}
      tabItems={sidebarNavItems}
    >
      <Outlet />
    </Main>
  );
}
