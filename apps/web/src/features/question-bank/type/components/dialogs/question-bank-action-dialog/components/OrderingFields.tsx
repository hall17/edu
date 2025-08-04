import { OrderingQuestionData } from '@edusama/common';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { IconGripVertical, IconPlus, IconTrash } from '@tabler/icons-react';
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

interface OrderingFieldsProps {
  form: UseFormReturn<FormData>;
  watchedQuestionData: OrderingQuestionData;
  watchedOptionFields: string[];
}

export function OrderingFields({
  form,
  watchedQuestionData,
  watchedOptionFields,
}: OrderingFieldsProps) {
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

    const currentOptions = form.getValues('questionData.options');
    const reorderedOptions = Array.from(currentOptions);
    const [removed] = reorderedOptions.splice(sourceIndex, 1);
    reorderedOptions.splice(destinationIndex, 0, removed);

    form.setValue('questionData.options', reorderedOptions);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel className="text-base font-medium">
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
            <IconPlus size={16} />
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
                {watchedOptionFields.map((_option, index) => (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`px-2 py-2 ${
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
                              name={`questionData.options.${index}`}
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex flex-col sm:flex-row">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="flex h-8 w-6 cursor-grab items-center justify-center text-gray-400 hover:text-gray-600 active:cursor-grabbing"
                                    >
                                      <IconGripVertical size={16} />
                                    </div>
                                    <FormLabel
                                      required
                                      className="sm:min-w-[80px] sm:text-right"
                                    >
                                      {t('questionBank.form.optionText', {
                                        number: index + 1,
                                      })}
                                    </FormLabel>
                                    <FormControl className="ml-1 flex-1">
                                      <Input
                                        {...field}
                                        className="!ml-2 h-8"
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
                                    (_, index) => index !== index
                                  )
                                );
                              }}
                              className="text-red-500 hover:bg-red-50 hover:text-red-700"
                            >
                              <IconTrash size={16} />
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
            <FormLabel>{t('questionBank.form.options')}</FormLabel>
            <FormControl>
              <MultiSelect
                options={
                  watchedOptionFields?.map((option, optionIndex) => ({
                    label:
                      option ||
                      t('questionBank.form.optionText', {
                        number: optionIndex + 1,
                      }),
                    value: optionIndex.toString(),
                  })) ?? []
                }
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
