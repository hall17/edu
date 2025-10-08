import {
  EssayQuestionData,
  MatchingQuestionData,
  MultipleChoiceQuestionData,
  OrderingQuestionData,
  QuestionData,
  ShortAnswerQuestionData,
  TrueFalseQuestionData,
} from '@edusama/common';
import { QuestionType, QuestionDifficulty } from '@edusama/server';
import { useTranslation } from 'react-i18next';

import { useQuestionBankContext } from '../../QuestionBankContext';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function QuestionBankViewDialog() {
  const { t } = useTranslation();
  const { currentRow, openedDialog } = useQuestionBankContext();

  if (openedDialog !== 'view' || !currentRow) {
    return null;
  }

  const renderQuestionDetails = () => {
    switch (currentRow.type) {
      case QuestionType.MULTIPLE_CHOICE: {
        const questionData =
          currentRow.questionData as MultipleChoiceQuestionData;
        return (
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">
                {t('questionBank.form.multipleChoiceType')}
              </h4>
              <Badge variant="outline">
                {questionData.multipleChoiceType === 'SINGLE_ANSWER'
                  ? t('questionBank.multipleChoiceTypes.SINGLE_ANSWER')
                  : t('questionBank.multipleChoiceTypes.MULTIPLE_ANSWERS')}
              </Badge>
            </div>

            {questionData.options && (
              <div>
                <h4 className="mb-2 font-semibold">
                  {t('questionBank.form.options')}
                </h4>
                <div className="bg-muted rounded-md p-3">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(questionData.options, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {questionData.correctAnswers && (
              <div>
                <h4 className="mb-2 font-semibold">
                  {t('questionBank.form.correctAnswers')}
                </h4>
                <div className="bg-muted rounded-md p-3">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(questionData.correctAnswers, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        );
      }

      case QuestionType.TRUE_FALSE: {
        const questionData = currentRow.questionData as TrueFalseQuestionData;
        return (
          <div>
            <h4 className="mb-2 font-semibold">
              {t('questionBank.form.correctAnswers')}
            </h4>
            <Badge
              variant={
                questionData.correctAnswers?.[0] === 'true'
                  ? 'default'
                  : 'secondary'
              }
            >
              {questionData.correctAnswers?.[0] === 'true' ? 'True' : 'False'}
            </Badge>
          </div>
        );
      }

      case QuestionType.MATCHING: {
        const questionData = currentRow.questionData as MatchingQuestionData;
        return (
          <div>
            <h4 className="mb-2 font-semibold">
              {t('questionBank.form.pairs')}
            </h4>
            {questionData.pairs && (
              <div className="bg-muted rounded-md p-3">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(questionData.pairs, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );
      }

      case QuestionType.FILL_IN_BLANK:
      case QuestionType.SHORT_ANSWER:
      case QuestionType.ESSAY: {
        const questionData = currentRow.questionData as
          | ShortAnswerQuestionData
          | EssayQuestionData;
        return (
          <div>
            <h4 className="mb-2 font-semibold">
              {t('questionBank.form.correctAnswers')}
            </h4>
            {questionData.correctAnswers && (
              <div className="bg-muted rounded-md p-3">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(questionData.correctAnswers, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );
      }

      case QuestionType.ORDERING: {
        const questionData = currentRow.questionData as OrderingQuestionData;
        return (
          <div>
            <h4 className="mb-2 font-semibold">
              {t('questionBank.form.orderOptions')}
            </h4>
            {questionData.options && (
              <div className="bg-muted rounded-md p-3">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(questionData.options, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Dialog open={openedDialog === 'view'}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t('questionBank.dialogs.viewTitle')}</DialogTitle>
          <DialogDescription>
            {t('questionBank.dialogs.viewDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold">
                {t('questionBank.form.type')}
              </h4>
              <Badge variant="outline" className="capitalize">
                {t(`questionTypes.${currentRow.type}`)}
              </Badge>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">
                {t('questionBank.form.difficulty')}
              </h4>
              <Badge variant="secondary" className="capitalize">
                {t(`questionDifficulties.${currentRow.difficulty}`)}
              </Badge>
            </div>

            {currentRow.subject && (
              <div>
                <h4 className="mb-2 font-semibold">
                  {t('questionBank.form.subject')}
                </h4>
                <div className="text-sm">{currentRow.subject.name}</div>
              </div>
            )}

            {currentRow.curriculum && (
              <div>
                <h4 className="mb-2 font-semibold">
                  {t('questionBank.form.curriculum')}
                </h4>
                <div className="text-sm">{currentRow.curriculum.name}</div>
              </div>
            )}

            {currentRow.lesson && (
              <div>
                <h4 className="mb-2 font-semibold">
                  {t('questionBank.form.lesson')}
                </h4>
                <div className="text-sm">{currentRow.lesson.name}</div>
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-2 font-semibold">
              {t('questionBank.form.questionText')}
            </h4>
            <div className="bg-muted rounded-md p-3">
              <p className="text-sm whitespace-pre-wrap">
                {currentRow.questionText}
              </p>
            </div>
          </div>

          {renderQuestionDetails()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
