import { MatchingQuestionData } from '@edusama/common';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormData } from '../QuestionBankActionDialog';

import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';

interface MatchingFieldsProps {
  form: UseFormReturn<FormData>;
}

export function MatchingFields({ form }: MatchingFieldsProps) {
  const { t } = useTranslation();
  const watchedQuestionData = form.watch(
    'questionData'
  ) as MatchingQuestionData;
  const pairs = watchedQuestionData.pairs;

  const handleOptionDragEnd = (
    result: DropResult,
    key: 'leftColumn' | 'rightColumn'
  ) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) {
      return;
    }

    const reorderedOptions = Array.from(pairs[key]);
    const [removed] = reorderedOptions.splice(sourceIndex, 1);
    reorderedOptions.splice(destinationIndex, 0, removed);

    form.setValue(`questionData.pairs.${key}`, reorderedOptions as string[]);
  };

  return (
    <>
      {/* <FormField
        control={form.control}
        name="questionData.pairs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('questionBank.form.pairs')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('questionBank.form.pairsPlaceholder')}
                className="resize-none"
                {...field}
                value={field.value ? JSON.stringify(field.value, null, 2) : ''}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    field.onChange(parsed);
                  } catch {
                    field.onChange(e.target.value);
                  }
                }}
                rows={8}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}
      <div className="space-y-3">
        <div className="flex w-full justify-between gap-8">
          <FormField
            control={form.control}
            name="questionData.pairs.leftColumn"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex items-center justify-between">
                  <FormLabel>{t('questionBank.form.leftPairs')}</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.setValue(`questionData.pairs.leftColumn`, [
                        ...pairs.leftColumn,
                        '',
                      ]);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Plus size={14} />
                    {t('questionBank.form.addOption')}
                  </Button>
                </div>
                <FormControl>
                  <DragDropContext
                    onDragEnd={(result) =>
                      handleOptionDragEnd(result, 'leftColumn')
                    }
                  >
                    <Droppable droppableId="options">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-3"
                        >
                          {pairs.leftColumn.map((_option, optionIndex) => (
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
                                        name={`questionData.pairs.leftColumn.${optionIndex}`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <div className="flex flex-col sm:flex-row">
                                              <div
                                                {...provided.dragHandleProps}
                                                className="flex h-8 w-6 cursor-grab items-center justify-center text-gray-400 hover:text-gray-600 active:cursor-grabbing"
                                              >
                                                <GripVertical size={16} />
                                              </div>
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
                                            `questionData.pairs.leftColumn`,
                                            pairs.leftColumn.filter(
                                              (_, index) =>
                                                index !== optionIndex
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="questionData.pairs.rightColumn"
            render={() => (
              <FormItem className="w-full">
                <div className="flex items-center justify-between">
                  <FormLabel>{t('questionBank.form.rightPairs')}</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.setValue(`questionData.pairs.rightColumn`, [
                        ...pairs.rightColumn,
                        '',
                      ]);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Plus size={14} />
                    {t('questionBank.form.addOption')}
                  </Button>
                </div>
                <FormControl>
                  <DragDropContext
                    onDragEnd={(result) =>
                      handleOptionDragEnd(result, 'rightColumn')
                    }
                  >
                    <Droppable droppableId="options">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-3"
                        >
                          {pairs.rightColumn.map((_option, optionIndex) => (
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
                                        name={`questionData.pairs.rightColumn.${optionIndex}`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <div className="flex flex-col sm:flex-row">
                                              <div
                                                {...provided.dragHandleProps}
                                                className="flex h-8 w-6 cursor-grab items-center justify-center text-gray-400 hover:text-gray-600 active:cursor-grabbing"
                                              >
                                                <GripVertical size={16} />
                                              </div>
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
                                            `questionData.pairs.rightColumn`,
                                            pairs.rightColumn.filter(
                                              (_, index) =>
                                                index !== optionIndex
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="questionData.correctAnswers"
        render={() => (
          <FormItem>
            <FormLabel>{t('questionBank.form.correctAnswers')}</FormLabel>
            <DragDropContext
              onDragEnd={(result) => {
                if (!result.destination) {
                  return;
                }

                const sourceDroppableId = result.source.droppableId;
                const destinationDroppableId = result.destination.droppableId;

                // If dragging from unmatched options to a matched option
                if (
                  sourceDroppableId === 'correctAnswers' &&
                  destinationDroppableId !== 'correctAnswers'
                ) {
                  const sourceIndex = result.source.index;
                  const destinationIndex = parseInt(destinationDroppableId);

                  // Extract the original rightColumn index from draggableId
                  const draggedRightColumnIndex = parseInt(
                    result.draggableId.replace('unmatched-', '')
                  );

                  if (draggedRightColumnIndex !== undefined) {
                    // Create a new correctAnswers object
                    const newCorrectAnswers = {
                      ...watchedQuestionData.correctAnswers,
                    };

                    // If there's already a match for this destination, remove it first
                    Object.keys(newCorrectAnswers).forEach((key) => {
                      const numericKey = parseInt(key);
                      if (
                        newCorrectAnswers[numericKey] ===
                        draggedRightColumnIndex
                      ) {
                        delete newCorrectAnswers[numericKey];
                      }
                    });

                    // Set the new match
                    newCorrectAnswers[destinationIndex] =
                      draggedRightColumnIndex;

                    form.setValue(
                      'questionData.correctAnswers',
                      newCorrectAnswers
                    );
                  }
                }
                // If dragging from a matched option back to unmatched options (removing the match)
                else if (
                  sourceDroppableId !== 'correctAnswers' &&
                  destinationDroppableId === 'correctAnswers'
                ) {
                  const sourceIndex = parseInt(
                    result.draggableId.replace('matched-', '')
                  );

                  // Create a new correctAnswers object and remove the match
                  const newCorrectAnswers = {
                    ...watchedQuestionData.correctAnswers,
                  };
                  delete newCorrectAnswers[sourceIndex];

                  form.setValue(
                    'questionData.correctAnswers',
                    newCorrectAnswers
                  );
                }
              }}
            >
              <span>Eşleştirilmemiş Seçenekler</span>
              <Droppable droppableId="correctAnswers" isDropDisabled={false}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[60px] rounded-md border-2 border-dashed p-2 transition-colors ${
                      snapshot.isDraggingOver
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {watchedQuestionData.pairs.rightColumn
                      .map((option, originalIndex) => ({
                        option,
                        originalIndex,
                        isMatched: Object.values(
                          watchedQuestionData.correctAnswers
                        ).includes(originalIndex),
                      }))
                      .filter((item) => !item.isMatched)
                      .map((item, filteredIndex) => {
                        return (
                          <Draggable
                            key={item.originalIndex}
                            draggableId={`unmatched-${item.originalIndex}`}
                            index={filteredIndex}
                          >
                            {(provided, snapshot) => (
                              <Badge
                                variant="outline"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`p-2 ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''}`}
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex cursor-grab items-center justify-center text-gray-400 hover:text-gray-600 active:cursor-grabbing"
                                >
                                  <GripVertical size={16} />
                                </div>
                                {item.option ||
                                  t('questionBank.form.optionText', {
                                    number: item.originalIndex + 1,
                                  })}
                              </Badge>
                            )}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {/* <FormControl> */}
              <span>Eşleştirilmiş Seçenekler</span>
              {watchedQuestionData.pairs.leftColumn.map(
                (option, optionIndex) => {
                  const correctAnswer =
                    watchedQuestionData.correctAnswers[optionIndex];
                  return (
                    <div className="flex items-center gap-2">
                      <Badge
                        key={optionIndex}
                        variant="outline"
                        className="p-2"
                      >
                        {option ||
                          t('questionBank.form.optionText', {
                            number: optionIndex + 1,
                          })}
                      </Badge>
                      <Droppable
                        key={optionIndex.toString()}
                        droppableId={optionIndex.toString()}
                      >
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`min-h-[40px] rounded-md border-2 border-dashed p-2 transition-colors ${
                              snapshot.isDraggingOver
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-300'
                            }`}
                          >
                            {(() => {
                              const matchedRightIndex =
                                watchedQuestionData.correctAnswers[optionIndex];
                              if (matchedRightIndex !== undefined) {
                                const matchedOption =
                                  watchedQuestionData.pairs.rightColumn[
                                    matchedRightIndex
                                  ];
                                return (
                                  <Draggable
                                    key={`matched-${optionIndex}`}
                                    draggableId={`matched-${optionIndex}`}
                                    index={0}
                                  >
                                    {(provided, snapshot) => (
                                      <Badge
                                        variant="secondary"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`p-2 ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''}`}
                                      >
                                        <div
                                          {...provided.dragHandleProps}
                                          className="flex cursor-grab items-center justify-center text-gray-400 hover:text-gray-600 active:cursor-grabbing"
                                        >
                                          <GripVertical size={16} />
                                        </div>
                                        {matchedOption ||
                                          t('questionBank.form.optionText', {
                                            number: matchedRightIndex + 1,
                                          })}
                                      </Badge>
                                    )}
                                  </Draggable>
                                );
                              }
                              return (
                                <div className="flex h-8 items-center justify-center text-sm text-gray-400">
                                  Drop here
                                </div>
                              );
                            })()}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                }
              )}
            </DragDropContext>
            {/* {Object.entries(watchedQuestionData.correctAnswers).map(
                ([key, value]) => {
                  return (
                    <div key={key}>
                      {key}: {value}
                    </div>
                  );
                }
              )} */}
            {/* </FormControl> */}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
