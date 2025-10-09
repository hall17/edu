import {
  EssayQuestionData,
  FillInBlankQuestionData,
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

function splitTextIntoWords(text: string) {
  return text.split(/\s+/).filter((word) => word.length > 0);
}

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getQuestionDifficultyBadgeVariant } from '@/utils';

export function QuestionBankViewDialog() {
  const { t } = useTranslation();
  const { currentRow, openedDialog, setOpenedDialog } =
    useQuestionBankContext();

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

            {questionData.options && questionData.options.length > 0 && (
              <div>
                <h4 className="mb-2 font-semibold">
                  {t('questionBank.form.options')}
                </h4>
                <div className="space-y-2">
                  {questionData.options.map((option, index) => (
                    <div
                      key={index}
                      className="bg-muted flex items-center gap-2 rounded-md p-2"
                    >
                      <span className="bg-background flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {questionData.correctAnswers &&
              questionData.correctAnswers.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold">
                    {t('questionBank.form.correctAnswers')}
                  </h4>
                  <div className="space-y-2">
                    {questionData.correctAnswers.map((answerIndex, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-2"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-800">
                          ✓
                        </span>
                        <span className="text-sm">
                          {questionData.options?.[answerIndex] ||
                            `Option ${answerIndex + 1}`}
                        </span>
                      </div>
                    ))}
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
                  ? 'success'
                  : 'destructive'
              }
              className="px-3 py-1 text-sm"
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
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <h5 className="text-muted-foreground text-sm font-medium">
                      Left Column
                    </h5>
                    {questionData.pairs.leftColumn.map((item, index) => (
                      <div
                        key={index}
                        className="bg-muted rounded-md p-2 text-sm"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-muted-foreground text-sm font-medium">
                      Right Column
                    </h5>
                    {questionData.pairs.rightColumn.map((item, index) => (
                      <div
                        key={index}
                        className="bg-muted rounded-md p-2 text-sm"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      case QuestionType.FILL_IN_BLANK: {
        const questionData = currentRow.questionData as FillInBlankQuestionData;
        const words = splitTextIntoWords(currentRow.questionText);
        const blankPositions = new Set(questionData.correctAnswers || []);

        // Render question text with blanks filled in
        const renderQuestionWithFilledBlanks = () => {
          return words.map((word, index) => {
            if (blankPositions.has(index)) {
              // This word should be a blank - show the correct answer (the word itself)
              return (
                <span key={index} className="inline-block">
                  <span className="mx-1 rounded bg-green-100 px-2 py-1 text-green-800">
                    {word}
                  </span>{' '}
                </span>
              );
            }
            return <span key={index}>{word} </span>;
          });
        };

        return (
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">
                {t('questionBank.form.questionWithAnswers')}
              </h4>
              <div className="bg-muted rounded-md p-3">
                <div className="text-sm">
                  {renderQuestionWithFilledBlanks()}
                </div>
              </div>
            </div>

            {questionData.correctAnswers &&
              questionData.correctAnswers.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold">
                    {t('questionBank.form.blankPositions')}
                  </h4>
                  <div className="space-y-2">
                    {questionData.correctAnswers.map(
                      (blankIndex, displayIndex) => (
                        <div
                          key={displayIndex}
                          className="bg-muted rounded-md p-2"
                        >
                          <span className="text-sm">
                            {t('questionBank.fillInBlank.blank')}{' '}
                            {displayIndex + 1}:{' '}
                            {words[blankIndex] ||
                              t('questionBank.fillInBlank.invalidPosition')}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        );
      }

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
            {questionData.correctAnswers &&
            questionData.correctAnswers.length > 0 ? (
              <div className="space-y-2">
                {questionData.correctAnswers.map((answer, index) => (
                  <div key={index} className="bg-muted rounded-md p-2">
                    <span className="text-sm">{answer}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted rounded-md p-2">
                <span className="text-muted-foreground text-sm">
                  No correct answers specified
                </span>
              </div>
            )}
          </div>
        );
      }

      case QuestionType.ORDERING: {
        const questionData = currentRow.questionData as OrderingQuestionData;
        return (
          <div className="space-y-4">
            <h4 className="mb-2 font-semibold">
              {t('questionBank.form.orderOptions')}
            </h4>
            {questionData.options && questionData.options.length > 0 ? (
              <div className="space-y-2">
                {questionData.options.map((option, index) => (
                  <div
                    key={index}
                    className="bg-muted flex items-center gap-2 rounded-md p-2"
                  >
                    <span className="bg-background flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm">{option}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted rounded-md p-2">
                <span className="text-muted-foreground text-sm">
                  No options specified
                </span>
              </div>
            )}

            {questionData.correctAnswers &&
              questionData.correctAnswers.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold">
                    {t('questionBank.form.correctOrder')}
                  </h4>
                  <div className="space-y-2">
                    {questionData.correctAnswers.map((answerIndex, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-2"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-800">
                          {index + 1}
                        </span>
                        <span className="text-sm">
                          {questionData.options?.[answerIndex] ||
                            `Option ${answerIndex + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
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
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
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
              <Badge
                variant={getQuestionDifficultyBadgeVariant(
                  currentRow.difficulty as QuestionDifficulty
                )}
                className="capitalize"
              >
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
