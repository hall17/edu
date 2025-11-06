import { QuestionType } from '@edusama/common';
import { createFileRoute } from '@tanstack/react-router';
import { useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import {
  QuestionBankDialogs,
  QuestionBankPrimaryButtons,
  QuestionBankTable,
} from './components';
import { QuestionBankProvider } from './QuestionBankContext';

import { Main } from '@/components/layout/Main';

export function QuestionBankTypeView() {
  const { t } = useTranslation();
  const { type } = useParams({
    from: '/_authenticated/question-bank/type/$type',
  });
  const typeTranslation = t(
    `questionTypes.${type.toUpperCase() as QuestionType}`
  );

  return (
    <QuestionBankProvider>
      <Main
        title={`${typeTranslation} ${t('questionBank.title')}`}
        description={`${typeTranslation} sorularını yönetin`}
        extra={<QuestionBankPrimaryButtons />}
        backButtonTo="/question-bank"
        backButton
      >
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <QuestionBankTable />
        </div>
      </Main>

      <QuestionBankDialogs />
    </QuestionBankProvider>
  );
}
