import { QuestionType } from '@edusama/common';
import { createFileRoute } from '@tanstack/react-router';
import { useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { QuestionBankDialogs, QuestionBankTable } from './components';
import { QuestionBankProvider } from './QuestionBankContext';

import { Main } from '@/components/layout/Main';

export function QuestionBankTypeView() {
  const { t } = useTranslation();
  const { type } = useParams({ strict: false });
  const typeTranslation = t(
    `questionTypes.${(type ?? '').toUpperCase() as QuestionType}`
  );

  const breadcrumbItems = [
    {
      label: t('questionBank.title'),
      href: '/question-bank',
    },
    {
      label: typeTranslation,
      href: `/question-bank/${type}`,
    },
  ];

  return (
    <QuestionBankProvider>
      <Main
        title={`${typeTranslation} ${t('questionBank.title')}`}
        description={`${typeTranslation} sorularını yönetin`}
        backButtonTo="/question-bank"
        backButton
        breadcrumbItems={breadcrumbItems}
      >
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <QuestionBankTable />
        </div>
      </Main>

      <QuestionBankDialogs />
    </QuestionBankProvider>
  );
}
