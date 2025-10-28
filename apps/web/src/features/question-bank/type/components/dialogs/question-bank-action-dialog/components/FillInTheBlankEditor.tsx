import { Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormData } from '../QuestionBankActionDialog';

import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function splitTextIntoWords(text: string) {
  return text.split(/\s+/).filter((word) => word.length > 0);
}

// Custom component for Fill-in-the-Blank question editor
interface FillInTheBlankEditorProps {
  form: UseFormReturn<FormData>;
  questionText: string;
  correctAnswers: number[];
  onQuestionTextChange: (text: string) => void;
  onCorrectAnswersChange: (answers: number[]) => void;
}

export function FillInTheBlankEditor({
  form,
  questionText,
  correctAnswers,
  onQuestionTextChange,
  onCorrectAnswersChange,
}: FillInTheBlankEditorProps) {
  const { t } = useTranslation();
  const words = splitTextIntoWords(questionText);

  // Split text into words and handle blank creation
  const handleWordClick = (wordIndex: number) => {
    const words = splitTextIntoWords(questionText);
    const targetWord = words[wordIndex];

    if (!targetWord || targetWord.trim() === '') return;

    // Check if this position already has a blank
    const existingBlankIndex = correctAnswers.findIndex(
      (answer) => answer === wordIndex
    );

    if (existingBlankIndex >= 0) {
      // Remove blank - remove the answer entry
      const newCorrectAnswers = correctAnswers.filter(
        (_, index) => index !== existingBlankIndex
      );
      onCorrectAnswersChange(newCorrectAnswers);
    } else {
      // Add blank - add a new answer entry with the word as the answer
      const newCorrectAnswers = [...correctAnswers, wordIndex];
      onCorrectAnswersChange(newCorrectAnswers);
    }
  };

  // Render text with clickable words
  const renderTextWithBlanks = () => {
    const words = splitTextIntoWords(questionText);
    const blankPositions = new Set(correctAnswers.map((answer) => answer));
    return words.map((word, index) => {
      if (word.trim() === '') {
        return <span key={index}>{word}</span>;
      }

      const isBlank = blankPositions.has(index);
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              key={index}
              className={`inline-block cursor-pointer rounded px-1 py-0.5 transition-colors ${
                isBlank
                  ? 'border border-red-300 bg-red-100 text-red-400'
                  : 'hover:bg-red-100 hover:text-gray-800'
              }`}
              onClick={() => handleWordClick(index)}
            >
              {isBlank ? '______' : word}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {isBlank
              ? t('questionBank.fillInBlank.clickToRemoveBlank')
              : t('questionBank.fillInBlank.clickToMakeBlank')}
          </TooltipContent>
        </Tooltip>
      );
    });
  };

  // Handle correct answer changes
  const handleCorrectAnswerChange = (blankIndex: number, value: string) => {
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[blankIndex] = Number(value);
    onCorrectAnswersChange(newCorrectAnswers);
  };

  // Remove blank and answer
  const removeBlank = (blankIndex: number) => {
    const newCorrectAnswers = correctAnswers.filter(
      (_, index) => index !== blankIndex
    );
    onCorrectAnswersChange(newCorrectAnswers);
  };

  return (
    <div className="space-y-4">
      {/* Question Text Editor */}
      <div>
        <FormLabel className="text-sm font-medium">
          {t('questionBank.form.questionTextEditor')}
        </FormLabel>
        <div className="mt-1.5 min-h-[40px] rounded-md border bg-gray-50 p-3">
          {questionText.trim() === '' ? (
            <span className="text-gray-400 italic">
              {t('questionBank.fillInBlank.enterQuestionText')}
            </span>
          ) : (
            renderTextWithBlanks()
          )}
        </div>
      </div>
      {correctAnswers.length === 0 && questionText.trim() !== '' && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-gray-500">
          {t('questionBank.fillInBlank.clickWordsToMakeBlanks')}
        </div>
      )}
      {/* Blanks and Correct Answers */}
      <div className="bg-white-50 min-h-12 space-y-3 rounded-md border p-3">
        {correctAnswers.length > 0 && (
          <div className="space-y-2">
            {correctAnswers.map((answer, index) => (
              <div
                key={`${answer}-${index}`}
                className="flex items-center gap-2 rounded-md border bg-green-50 p-2"
              >
                <span className="min-w-[100px] text-sm font-medium text-green-700">
                  {t('questionBank.fillInBlank.blank')} {index + 1}:
                </span>
                <Input
                  placeholder={t(
                    'questionBank.fillInBlank.correctAnswerPlaceholder'
                  )}
                  value={words[answer] || ''}
                  onChange={(e) =>
                    handleCorrectAnswerChange(index, e.target.value)
                  }
                  className="flex-1 bg-white !opacity-100"
                  disabled
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBlank(index)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
