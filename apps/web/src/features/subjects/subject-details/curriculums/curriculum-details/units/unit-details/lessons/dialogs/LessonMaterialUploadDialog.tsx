import {
  LessonMaterialCreateDto,
  lessonMaterialCreateSchema,
  LessonMaterialType,
} from '@edusama/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useUnitLessonsContext } from '../UnitLessonsContext';

import { LoadingButton, UnsavedChangesDialog } from '@/components';
import { DroppableFile } from '@/components/DroppableFile';
import { DroppableImage } from '@/components/DroppableImage';
import { Button } from '@/components/ui/button';
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
  FormDescription,
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { DEFAULT_IMAGE_SIZE } from '@/utils/constants';
import { useSubjectDetailsContext } from '@/features/subjects/subject-details/SubjectDetailsContext';

// File type configurations
const FILE_CONFIGS = {
  [LessonMaterialType.DOCUMENT]: {
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        ['.pptx'],
      'text/plain': ['.txt'],
    },
  },
  [LessonMaterialType.AUDIO]: {
    maxSize: 100 * 1024 * 1024, // 100MB
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
    },
  },
  [LessonMaterialType.VIDEO]: {
    maxSize: 1024 * 1024 * 1024, // 1GB
    accept: {
      'video/*': ['.mp4', '.webm', '.ogg', '.mov', '.avi'],
    },
  },
};

// Combined accept object for all file types
const ALL_FILE_TYPES_ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    '.pptx',
  ],
  'text/plain': ['.txt'],
  'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
  'video/*': ['.mp4', '.webm', '.ogg', '.mov', '.avi'],
};

// Maximum size among all types (for initial upload, then validated based on type)
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

export function LessonMaterialUploadDialog() {
  const { t } = useTranslation();
  const { subjectQuery } = useSubjectDetailsContext();
  const { openedDialog, setOpenedDialog, currentRow } = useUnitLessonsContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [materialFile, setMaterialFile] = useState<File | null | undefined>(
    undefined
  );
  const [thumbnailFile, setThumbnailFile] = useState<File | null | undefined>(
    undefined
  );
  const [uploadProgress, setUploadProgress] = useState<{
    material: number;
    thumbnail: number;
  }>({ material: 0, thumbnail: 0 });
  const [isUploading, setIsUploading] = useState(false);

  const isOpen = openedDialog === 'add-material';

  const createMaterialMutation = useMutation(
    trpc.lessonMaterial.create.mutationOptions()
  );

  const defaultValues: LessonMaterialCreateDto = {
    lessonId: currentRow?.id ?? '',
    name: '',
    description: '',
    type: LessonMaterialType.DOCUMENT,
    url: '',
    thumbnailUrl: '',
    isShareable: false,
  };

  const form = useForm<LessonMaterialCreateDto>({
    resolver: zodResolver(lessonMaterialCreateSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const materialType = useWatch({
    control: form.control,
    name: 'type',
  });

  // Auto-detect material type from file
  useEffect(() => {
    if (materialFile) {
      const fileType = materialFile.type;
      let detectedType: LessonMaterialType = LessonMaterialType.DOCUMENT;

      if (fileType.startsWith('video/')) {
        detectedType = LessonMaterialType.VIDEO;
      } else if (fileType.startsWith('audio/')) {
        detectedType = LessonMaterialType.AUDIO;
      } else if (
        fileType.startsWith('application/') ||
        fileType.startsWith('text/')
      ) {
        detectedType = LessonMaterialType.DOCUMENT;
      }

      form.setValue('type', detectedType);

      const nameWithoutExt = materialFile.name.replace(/\.[^/.]+$/, '');
      form.setValue('name', nameWithoutExt);
    }
  }, [materialFile, form]);

  // Calculate duration for audio/video files
  useEffect(() => {
    if (
      materialFile &&
      (materialType === LessonMaterialType.AUDIO ||
        materialType === LessonMaterialType.VIDEO)
    ) {
      const url = URL.createObjectURL(materialFile);
      const element =
        materialType === LessonMaterialType.VIDEO
          ? document.createElement('video')
          : document.createElement('audio');

      element.src = url;
      element.onloadedmetadata = () => {
        // Duration will be sent to backend when creating
        URL.revokeObjectURL(url);
      };
    }
  }, [materialFile, materialType]);

  // Calculate page count for PDFs (would need a library like pdf.js for accurate count)
  useEffect(() => {
    if (
      materialFile &&
      materialType === LessonMaterialType.DOCUMENT &&
      materialFile.type === 'application/pdf'
    ) {
      // Page count calculation would be done on the backend
      // This is just a placeholder for the client-side logic
    }
  }, [materialFile, materialType]);

  // Helper function to upload file with progress tracking
  function uploadFileWithProgress(
    file: File,
    signedUrl: string,
    onProgress: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload aborted'));
      });

      xhr.open('PUT', signedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  function handleDialogClose(state: boolean) {
    // Prevent closing during upload
    if (isUploading) {
      toast.warning(t('subjects.lessons.materials.uploadInProgress'));
      return;
    }

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
      handleClose();
    }
  }

  function handleConfirmClose() {
    setShowConfirmDialog(false);
    handleClose();
  }

  function handleClose() {
    form.reset();
    setMaterialFile(undefined);
    setThumbnailFile(undefined);
    setUploadProgress({ material: 0, thumbnail: 0 });
    setIsUploading(false);
    setOpenedDialog(null);
  }

  function handleCancelClose() {
    setShowConfirmDialog(false);
  }

  async function onSubmit(values: LessonMaterialCreateDto) {
    if (!currentRow) {
      toast.error(t('subjects.lessons.materials.noLessonSelected'));
      return;
    }

    if (!materialFile) {
      toast.error(t('subjects.lessons.materials.fileRequired'));
      return;
    }

    // Validate file size based on detected type
    const currentConfig = FILE_CONFIGS[values.type];
    if (materialFile.size > currentConfig.maxSize) {
      const maxSizeLabel =
        currentConfig.maxSize / (1024 * 1024) >= 1024
          ? `${currentConfig.maxSize / (1024 * 1024 * 1024)}GB`
          : `${currentConfig.maxSize / (1024 * 1024)}MB`;
      toast.error(
        `File size exceeds the maximum limit for ${values.type.toLowerCase()} files (${maxSizeLabel})`
      );
      return;
    }

    try {
      const response = await createMaterialMutation.mutateAsync(values);

      // Reset progress and set uploading state
      setUploadProgress({ material: 0, thumbnail: 0 });
      setIsUploading(true);

      // Handle file upload to S3 with progress tracking
      if (materialFile && response.urlSignedAwsS3Url) {
        await uploadFileWithProgress(
          materialFile,
          response.urlSignedAwsS3Url,
          (progress) => {
            setUploadProgress((prev) => ({ ...prev, material: progress }));
          }
        );
      }

      // Handle thumbnail upload with progress tracking
      if (thumbnailFile && response.thumbnailSignedAwsS3Url) {
        await uploadFileWithProgress(
          thumbnailFile,
          response.thumbnailSignedAwsS3Url,
          (progress) => {
            setUploadProgress((prev) => ({ ...prev, thumbnail: progress }));
          }
        );
      }

      setIsUploading(false);
      toast.success(t('subjects.lessons.materials.uploadSuccess'));

      await subjectQuery.refetch();

      handleClose();
    } catch (error) {
      console.error('Error uploading material:', error);
      setIsUploading(false);
      toast.error(t('subjects.lessons.materials.uploadError'));
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="xs:max-w-[80%] max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader className="mb-4 text-left">
            <DialogTitle>
              {t('subjects.lessons.materials.uploadDialog.title')}
            </DialogTitle>
            <DialogDescription>
              {t('subjects.lessons.materials.uploadDialog.description')}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              id="material-upload-form"
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log(errors);
              })}
              className="space-y-4"
              tabIndex={0}
            >
              {/* Upload Progress Indicators */}
              {isUploading && (
                <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
                  {uploadProgress.material > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {t(
                            'subjects.lessons.materials.uploadDialog.uploadingMaterial'
                          )}
                        </span>
                        <span className="text-muted-foreground">
                          {uploadProgress.material}%
                        </span>
                      </div>
                      <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full transition-all duration-300"
                          style={{ width: `${uploadProgress.material}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {uploadProgress.thumbnail > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {t(
                            'subjects.lessons.materials.uploadDialog.uploadingThumbnail'
                          )}
                        </span>
                        <span className="text-muted-foreground">
                          {uploadProgress.thumbnail}%
                        </span>
                      </div>
                      <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full transition-all duration-300"
                          style={{ width: `${uploadProgress.thumbnail}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      {t('subjects.lessons.materials.uploadDialog.file')}
                    </FormLabel>
                    <FormControl>
                      <DroppableFile
                        value={
                          materialFile === null
                            ? undefined
                            : field.value || undefined
                        }
                        onChange={(file) => {
                          field.onChange(file ? file.name : '');
                          setMaterialFile(file);
                        }}
                        accept={ALL_FILE_TYPES_ACCEPT}
                        maxSize={MAX_FILE_SIZE}
                        uploadText={t(
                          'subjects.lessons.materials.uploadDialog.uploadFile'
                        )}
                        changeText={t(
                          'subjects.lessons.materials.uploadDialog.changeFile'
                        )}
                        helpText={`Documents: 10MB max | Audio: 100MB max | Video: 1GB max`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('common.type')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('common.selectFile')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={LessonMaterialType.DOCUMENT}>
                          {t('materialTypes.DOCUMENT')}
                        </SelectItem>
                        <SelectItem value={LessonMaterialType.AUDIO}>
                          {t('materialTypes.AUDIO')}
                        </SelectItem>
                        <SelectItem value={LessonMaterialType.VIDEO}>
                          {t('materialTypes.VIDEO')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t(
                        'subjects.lessons.materials.uploadDialog.typeAutoFilled'
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('common.name')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'subjects.lessons.materials.uploadDialog.namePlaceholder'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.description')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          'subjects.lessons.materials.uploadDialog.descriptionPlaceholder'
                        )}
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Thumbnail Upload */}
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('subjects.lessons.materials.uploadDialog.thumbnail')}
                    </FormLabel>
                    <FormControl>
                      <DroppableImage
                        value={
                          thumbnailFile === null
                            ? undefined
                            : field.value || undefined
                        }
                        onChange={(file) => {
                          field.onChange(file ? file.name : '');
                          setThumbnailFile(file);
                        }}
                        size="lg"
                        uploadText={t(
                          'subjects.lessons.materials.uploadDialog.uploadThumbnail'
                        )}
                        changeText={t(
                          'subjects.lessons.materials.uploadDialog.changeThumbnail'
                        )}
                        helpText={t(
                          'subjects.lessons.materials.uploadDialog.thumbnailHelpText'
                        )}
                        maxSize={DEFAULT_IMAGE_SIZE}
                        accept={{
                          'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Shareable */}
              <FormField
                control={form.control}
                name="isShareable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t(
                          'subjects.lessons.materials.uploadDialog.isShareable'
                        )}
                      </FormLabel>
                      <FormDescription>
                        {t(
                          'subjects.lessons.materials.uploadDialog.isShareableDescription'
                        )}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleDialogClose(false)}
              disabled={createMaterialMutation.isPending || isUploading}
            >
              {t('common.cancel')}
            </Button>
            <LoadingButton
              type="submit"
              form="material-upload-form"
              isLoading={createMaterialMutation.isPending || isUploading}
            >
              {t('subjects.lessons.materials.uploadDialog.upload')}
            </LoadingButton>
          </DialogFooter>
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
