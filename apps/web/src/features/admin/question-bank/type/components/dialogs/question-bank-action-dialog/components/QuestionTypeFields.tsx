import {
  MultipleChoiceQuestionData,
  TrueFalseQuestionData,
  FillInBlankQuestionData,
  OrderingQuestionData,
  QuestionData,
} from '@edusama/common';
import { QuestionType } from '@edusama/common';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormData } from '../QuestionBankActionDialog';

import { FillInTheBlankEditor } from './FillInTheBlankEditor';
import { MatchingFields } from './MatchingFields';
import { MultipleChoiceFields } from './MultipleChoiceFields';
import { OrderingFields } from './OrderingFields';
import { TrueFalseFields } from './TrueFalseFields';

interface QuestionTypeFieldsProps {
  form: UseFormReturn<FormData>;
  selectedType: QuestionType;
  watchedQuestionData: QuestionData;
  watchedOptionFields: string[];
}

export function QuestionTypeFields({
  form,
  selectedType,
  watchedQuestionData,
  watchedOptionFields,
}: QuestionTypeFieldsProps) {
  const { t } = useTranslation();

  switch (selectedType) {
    case QuestionType.MULTIPLE_CHOICE: {
      const multipleChoiceQuestionData =
        watchedQuestionData as MultipleChoiceQuestionData;

      return (
        <MultipleChoiceFields
          form={form}
          watchedQuestionData={multipleChoiceQuestionData}
          watchedOptionFields={watchedOptionFields}
        />
      );
    }

    case QuestionType.TRUE_FALSE: {
      const trueFalseQuestionData =
        watchedQuestionData as TrueFalseQuestionData;

      return (
        <TrueFalseFields
          form={form}
          watchedQuestionData={trueFalseQuestionData}
        />
      );
    }

    case QuestionType.FILL_IN_BLANK: {
      return (
        <FillInTheBlankEditor
          form={form}
          questionText={form.watch('questionText')}
          correctAnswers={
            (watchedQuestionData.correctAnswers as number[]) || []
          }
          onQuestionTextChange={(text) => {
            form.setValue('questionText', text);
          }}
          onCorrectAnswersChange={(correctAnswers) => {
            const currentData = watchedQuestionData as FillInBlankQuestionData;
            form.setValue('questionData', {
              ...currentData,
              correctAnswers,
            } as FillInBlankQuestionData);
          }}
        />
      );
    }

    case QuestionType.MATCHING:
      return <MatchingFields form={form} />;

    case QuestionType.ORDERING: {
      const orderingQuestionData = watchedQuestionData as OrderingQuestionData;

      return (
        <OrderingFields
          form={form}
          watchedQuestionData={orderingQuestionData}
          watchedOptionFields={watchedOptionFields}
        />
      );
    }

    default:
      return null;
  }
}
