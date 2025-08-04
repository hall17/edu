import { TrueFalseQuestionData } from '@edusama/common';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormData } from '../QuestionBankActionDialog';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TrueFalseFieldsProps {
  form: UseFormReturn<FormData>;
  watchedQuestionData: TrueFalseQuestionData;
}

export function TrueFalseFields({
  form,
  watchedQuestionData,
}: TrueFalseFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <FormField
        control={form.control}
        name="questionData.correctAnswers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('questionBank.form.correctAnswers')}</FormLabel>
            <Select
              onValueChange={(value) => field.onChange([value])}
              value={
                Array.isArray(field.value) && field.value.length > 0
                  ? (field.value[0] as string)
                  : ''
              }
            >
              <FormControl className="w-full">
                <SelectTrigger>
                  <SelectValue
                    placeholder={t('questionBank.form.selectCorrectAnswer')}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="true">
                  {t('trueFalseOptions.true')}
                </SelectItem>
                <SelectItem value="false">
                  {t('trueFalseOptions.false')}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
