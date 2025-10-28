import { MultipleChoiceQuestionData } from '@edusama/common';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormData } from '../QuestionBankActionDialog';

import { MultiSelect } from '@/components';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MultipleChoiceFieldsProps {
  form: UseFormReturn<FormData>;
  watchedQuestionData: MultipleChoiceQuestionData;
  watchedOptionFields: string[];
}

export function MultipleChoiceFields({
  form,
  watchedQuestionData,
  watchedOptionFields,
}: MultipleChoiceFieldsProps) {
  const { t } = useTranslation();

  // Handle drag and drop for options
  const handleOptionDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) {
      return;
    }

    const reorderedOptions = Array.from(watchedQuestionData.options);
    const [removed] = reorderedOptions.splice(sourceIndex, 1);
    reorderedOptions.splice(destinationIndex, 0, removed);

    form.setValue('questionData.options', reorderedOptions);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="questionData.multipleChoiceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('questionBank.form.multipleChoiceType')}</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                if (value === 'SINGLE_ANSWER') {
                  const firstCorrectAnswer =
                    watchedQuestionData.correctAnswers?.[0];

                  form.setValue(
                    'questionData.correctAnswers',
                    firstCorrectAnswer === undefined
                      ? []
                      : [firstCorrectAnswer as number]
                  );
                }
              }}
              value={field.value || ''}
            >
              <FormControl className="w-full">
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t(
                      'questionBank.form.selectMultipleChoiceType'
                    )}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="SINGLE_ANSWER">
                  {t('questionBank.multipleChoiceTypes.SINGLE_ANSWER')}
                </SelectItem>
                <SelectItem value="MULTIPLE_ANSWERS">
                  {t('questionBank.multipleChoiceTypes.MULTIPLE_ANSWERS')}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FormLabel className="text-sm font-medium">
            {t('questionBank.form.options')}
          </FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              form.setValue(`questionData.options`, [
                ...watchedOptionFields,
                '',
              ]);
            }}
            className="flex items-center gap-2"
          >
            <Plus size={14} />
            {t('questionBank.form.addOption')}
          </Button>
        </div>

        <DragDropContext onDragEnd={handleOptionDragEnd}>
          <Droppable droppableId="options">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {watchedOptionFields.map((_option, optionIndex) => (
                  <Draggable
                    key={optionIndex}
                    draggableId={optionIndex.toString()}
                    index={optionIndex}
                  >
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`px-2 py-1.5 ${
                          snapshot.isDragging
                            ? 'shadow-lg ring-2 ring-blue-300'
                            : ''
                        }`}
                        style={{
                          ...provided.draggableProps.style,
                          left: 'auto !important',
                          top: 'auto !important',
                        }}
                      >
                        <CardHeader className="gap-0 space-x-1 p-0">
                          <CardTitle>
                            <FormField
                              control={form.control}
                              name={`questionData.options.${optionIndex}`}
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex flex-col sm:flex-row">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="flex h-8 w-6 cursor-grab items-center justify-center text-gray-400 hover:text-gray-600 active:cursor-grabbing"
                                    >
                                      <GripVertical size={16} />
                                    </div>
                                    <FormLabel
                                      required
                                      className="sm:min-w-[80px] sm:text-right"
                                    >
                                      {t('questionBank.form.optionText', {
                                        number: optionIndex + 1,
                                      })}
                                    </FormLabel>
                                    <FormControl className="flex-1">
                                      <Input
                                        {...field}
                                        className="ml-2 h-8"
                                        placeholder={t(
                                          'questionBank.form.optionPlaceholder'
                                        )}
                                      />
                                    </FormControl>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </CardTitle>
                          <CardAction>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                form.setValue(
                                  `questionData.options`,
                                  watchedOptionFields.filter(
                                    (_, index) => index !== optionIndex
                                  )
                                );
                              }}
                              className="text-red-500 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </CardAction>
                        </CardHeader>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <FormField
        control={form.control}
        name="questionData.correctAnswers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {watchedQuestionData.multipleChoiceType === 'SINGLE_ANSWER'
                ? t('questionBank.form.correctAnswer')
                : t('questionBank.form.correctAnswers')}
            </FormLabel>
            <FormControl>
              {watchedQuestionData.multipleChoiceType === 'SINGLE_ANSWER' ? (
                <Select
                  onValueChange={(value) => field.onChange([Number(value)])}
                  value={
                    Array.isArray(field.value) && field.value.length > 0
                      ? field.value[0].toString()
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
                    {watchedOptionFields.map((option, optionIndex) => (
                      <SelectItem
                        key={optionIndex}
                        value={optionIndex.toString()}
                      >
                        {option ||
                          t('questionBank.form.optionText', {
                            number: optionIndex + 1,
                          })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <MultiSelect
                  options={watchedOptionFields.map((option, optionIndex) => ({
                    label:
                      option ||
                      t('questionBank.form.optionText', {
                        number: optionIndex + 1,
                      }),
                    value: optionIndex.toString(),
                  }))}
                  onValueChange={(value) => {
                    field.onChange(value.map(Number));
                  }}
                  defaultValue={
                    Array.isArray(watchedQuestionData.correctAnswers)
                      ? watchedQuestionData.correctAnswers.map(String)
                      : []
                  }
                  placeholder={t('questionBank.form.selectCorrectAnswers')}
                  maxCount={watchedOptionFields.length}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
