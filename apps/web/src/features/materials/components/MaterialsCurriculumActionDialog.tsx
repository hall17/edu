import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { TFunction } from 'i18next';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useMaterialsContext } from '../MaterialsContext';

import { UnsavedChangesDialog } from '@/components';
import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CreatableCombobox,
  CreatableComboboxOption,
} from '@/components/ui/creatable-combobox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Curriculum, queryClient, trpc } from '@/lib/trpc';

interface Props {
  currentRow?: Curriculum;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  subjectId: z.uuid().or(z.string().min(1).max(50)),
  lessons: z.array(
    z.object({
      id: z.string().uuid().optional(),
      name: z.string().min(1).max(100),
      description: z.string().max(500).optional().nullable(),
      order: z.number(),
    })
  ),
});

type FormData = z.infer<typeof formSchema>;

export function MaterialsCurriculumActionDialog({
  currentRow,
  open,
  onOpenChange,
}: Props) {
  const { t } = useTranslation();
  const { createCurriculum, updateCurriculum, setOpen } = useMaterialsContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const createCurriculumMutation = useMutation(
    trpc.curriculum.create.mutationOptions()
  );
  const updateCurriculumMutation = useMutation(
    trpc.curriculum.update.mutationOptions()
  );
  const createSubjectMutation = useMutation(
    trpc.subject.create.mutationOptions()
  );

  const isEdit = !!currentRow;

  const subjectsQuery = useQuery(
    trpc.subject.findAll.queryOptions({ all: true })
  );

  const defaultValues: FormData = isEdit
    ? {
        name: currentRow?.name || '',
        description: currentRow?.description || undefined,
        subjectId: currentRow?.subjectId || '',
        lessons: currentRow?.lessons ?? [],
      }
    : {
        name: '',
        description: '',
        subjectId: '',
        lessons: [],
      };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control: form.control,
    name: 'lessons',
  });

  function handleDialogClose(state: boolean) {
    let isDirty = false;

    if (form.formState.defaultValues) {
      const diff = detailedDiff(form.formState.defaultValues, form.getValues());
      isDirty =
        Object.keys(diff.updated).length > 0 ||
        Object.keys(diff.added).length > 0 ||
        Object.keys(diff.deleted).length > 0;
    }

    if (!state && isDirty) {
      setShowConfirmDialog(true);
    } else {
      form.reset();
      onOpenChange(state);
    }
  }

  function handleConfirmClose() {
    setShowConfirmDialog(false);
    form.reset();
    onOpenChange(false);
  }

  function handleCancelClose() {
    setShowConfirmDialog(false);
  }

  // Prepare subject options for creatable combobox
  const subjectOptions: CreatableComboboxOption[] = useMemo(() => {
    const options: CreatableComboboxOption[] = [];

    // Add existing subjects
    if (subjectsQuery.data?.subjects) {
      subjectsQuery.data.subjects.forEach((subject) => {
        options.push({
          value: subject.id,
          label: subject.name,
        });
      });
    }

    return options;
  }, [subjectsQuery.data?.subjects]);

  const handleSubjectChange = (value: string) => {
    form.setValue('subjectId', value);
  };

  async function onSubmit(data: FormData) {
    try {
      if (isEdit && currentRow) {
        const diff = detailedDiff(defaultValues, data);

        if (!Object.keys(diff.updated).length) {
          return;
        }

        await updateCurriculumMutation.mutateAsync({
          ...data,
          id: currentRow!.id,
        });

        // Invalidate queries to refetch the updated data
        queryClient.invalidateQueries({
          queryKey: trpc.curriculum.findAll.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.subject.findAll.queryKey(),
        });

        toast.success(t('materials.actionDialog.updateSuccess'));
      } else {
        const curriculum = await createCurriculumMutation.mutateAsync(data);

        if (!curriculum) {
          return;
        }

        createCurriculum(curriculum);
        toast.success(t('materials.actionDialog.createSuccess'));
      }

      onOpenChange(false);
      setOpen(null);
    } catch (error) {
      console.error('Curriculum operation error:', error);
      toast.error(
        isEdit
          ? t('materials.actionDialog.updateError')
          : t('materials.actionDialog.createError')
      );
    }
  }

  const isLoading =
    createCurriculumMutation.isPending ||
    updateCurriculumMutation.isPending ||
    createSubjectMutation.isPending;

  const addLesson = () => {
    const order = lessonFields.length;
    appendLesson({
      name: '',
      description: '',
      order,
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) {
      return;
    }

    const currentLessons = form.getValues('lessons');
    const reorderedLessons = Array.from(currentLessons);
    const [removed] = reorderedLessons.splice(sourceIndex, 1);
    reorderedLessons.splice(destinationIndex, 0, removed);

    // Update order values
    const updatedLessons = reorderedLessons.map((lesson, index) => ({
      ...lesson,
      order: index,
    }));

    form.setValue('lessons', updatedLessons);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="xs:max-w-[80%] max-h-[90vh] sm:max-w-[70%]">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? t('materials.actionDialog.editTitle')
                : t('materials.actionDialog.createTitle')}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? t('materials.actionDialog.editDescription')
                : t('materials.actionDialog.createDescription')}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      {t('materials.actionDialog.fields.subject')}
                    </FormLabel>
                    <FormControl>
                      <CreatableCombobox
                        options={subjectOptions}
                        value={field.value}
                        onValueChange={handleSubjectChange}
                        placeholder={t('materials.actionDialog.selectSubject')}
                        searchPlaceholder={t(
                          'materials.actionDialog.searchSubjects'
                        )}
                        emptyText={t('materials.actionDialog.noSubjectsFound')}
                        createText="materials.actionDialog.createNewSubject"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      {t('materials.actionDialog.fields.name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t(
                          'materials.actionDialog.placeholders.name'
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('materials.actionDialog.fields.description')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder={t(
                          'materials.actionDialog.placeholders.description'
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base font-medium">
                    {t('materials.actionDialog.fields.lessons')}
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLesson}
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    {t('materials.actionDialog.addLesson')}
                  </Button>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="lessons">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3"
                      >
                        {lessonFields.map((field, lessonIndex) => (
                          <Draggable
                            key={field.id}
                            draggableId={field.id}
                            index={lessonIndex}
                          >
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`px-2 py-2 ${
                                  snapshot.isDragging
                                    ? 'shadow-lg ring-2 ring-blue-500'
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
                                      name={`lessons.${lessonIndex}.name`}
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
                                              {t(
                                                'materials.actionDialog.fields.lessonName'
                                              )}
                                            </FormLabel>
                                            <FormControl className="flex-1">
                                              <Input
                                                {...field}
                                                className="h-8"
                                                placeholder={t(
                                                  'materials.actionDialog.placeholders.lessonName'
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
                                      onClick={() => removeLesson(lessonIndex)}
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

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  {t('common.cancel')}
                </Button>
                <LoadingButton type="submit" isLoading={isLoading}>
                  {isEdit ? t('common.save') : t('common.create')}
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <UnsavedChangesDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </>
  );
}
