import { Camera, Check, Edit, Trash2, Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { FormControl, FormItem } from '@/components/ui/form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DroppableImageProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  customSize?: string;
  className?: string;
  uploadText?: string;
  changeText?: string;
  helpText?: string;
  previewTitle?: string;
  previewSubtitle?: string;
  fileTypeError?: string;
  fileSizeError?: string;
  label?: string;
}

const sizeClasses = {
  xs: 'size-12',
  sm: 'size-16',
  md: 'size-20',
  lg: 'size-24',
  xl: 'size-28',
  '2xl': 'size-32',
  '3xl': 'size-36',
  '4xl': 'size-40',
  '5xl': 'size-44',
};

const iconSizes = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
  '2xl': 'h-14 w-14',
  '3xl': 'h-16 w-16',
  '4xl': 'h-18 w-18',
};

const buttonSizes = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
  '2xl': 'h-14 w-14',
  '3xl': 'h-16 w-16',
  '4xl': 'h-18 w-18',
};

const actionIconSizes = {
  xs: 'h-2 w-2',
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
  '2xl': 'h-7 w-7',
  '3xl': 'h-8 w-8',
  '4xl': 'h-9 w-9',
};

export function DroppableImage({
  value,
  onChange,
  disabled = false,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
  },
  maxSize = 2 * 1024 * 1024, // 2MB default
  size = 'md',
  customSize = '',
  className = '',
  uploadText,
  changeText,
  helpText,
  previewTitle,
  previewSubtitle,
  fileTypeError,
  fileSizeError,
  label,
}: DroppableImageProps) {
  const { t } = useTranslation();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled) return;

      const file = acceptedFiles[0];
      if (file) {
        // Validate file type
        const allowedTypes = Object.keys(accept).flatMap((key) =>
          key === 'image/*' ? ['image/jpeg', 'image/png', 'image/webp'] : [key]
        );
        if (
          !allowedTypes.some((type) =>
            file.type.startsWith(type.replace('/*', '/'))
          )
        ) {
          toast.error(fileTypeError || t('common.profilePictureFileTypeError'));
          return;
        }

        // Validate file size
        if (file.size > maxSize) {
          toast.error(fileSizeError || t('common.profilePictureFileSizeError'));
          return;
        }

        // Convert to base64 for preview and form handling
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setImagePreview(base64);
          onChange(base64);
        };
        reader.readAsDataURL(file);
      }
    },
    [disabled, accept, maxSize, onChange, fileTypeError, fileSizeError, t]
  );

  const removeImage = useCallback(() => {
    onChange(undefined);
    setImagePreview(null);
    setIsPreviewOpen(false);
  }, [onChange]);

  // Image dropzone
  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
    inputRef: dropzoneInputRef,
  } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false,
    noClick: false,
    disabled,
  });

  // Combine refs
  const combinedInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (node && dropzoneInputRef.current !== node) {
        dropzoneInputRef.current = node;
      }
      if (imageInputRef.current !== node) {
        (imageInputRef as any).current = node;
      }
    },
    [dropzoneInputRef]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      if (value || imagePreview) {
        setIsPreviewOpen(true);
      } else {
        dropzoneInputRef.current?.click();
      }
    },
    [value, imagePreview, disabled, dropzoneInputRef]
  );

  return (
    <FormItem className="justify-center">
      {label && (
        <div className="mb-4 text-center">
          <p className="text-sm font-medium">{label}</p>
        </div>
      )}
      <div className="flex items-center justify-center gap-4">
        {/* Droppable Image */}
        <div className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  {...getImageRootProps()}
                  className={`group relative cursor-pointer transition-all duration-200 ${
                    disabled ? 'cursor-not-allowed opacity-50' : ''
                  } ${className} ${
                    isImageDragActive && !disabled
                      ? 'ring-primary scale-105 ring-2 ring-offset-2'
                      : ''
                  }`}
                  onClick={handleClick}
                >
                  <FormControl>
                    <input
                      {...getImageInputProps()}
                      ref={combinedInputRef}
                      disabled={disabled}
                    />
                  </FormControl>
                  <div
                    className={`border-muted-foreground/25 group-hover:border-primary/50 overflow-hidden rounded-lg border-2 border-dashed transition-all duration-200 ${
                      sizeClasses[size]
                    } ${customSize} }`}
                  >
                    {imagePreview || value ? (
                      <img
                        src={imagePreview || value}
                        alt="Image preview"
                        className="h-full w-full object-cover transition-all duration-200 group-hover:brightness-75"
                      />
                    ) : (
                      <div className="bg-muted/20 flex h-full items-center justify-center">
                        <Camera
                          className={`${iconSizes[size]} text-muted-foreground`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay with Actions */}
                  {!disabled && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {value || imagePreview ? (
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={`${buttonSizes[size]} rounded-full bg-white/20 p-0 text-white hover:bg-white/30`}
                            onClick={(e) => {
                              e.stopPropagation();
                              dropzoneInputRef.current?.click();
                            }}
                          >
                            <Edit className={actionIconSizes[size]} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={`${buttonSizes[size]} rounded-full bg-white/20 p-0 text-white hover:bg-red-500/80`}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage();
                            }}
                          >
                            <Trash2 className={actionIconSizes[size]} />
                          </Button>
                        </div>
                      ) : (
                        <Camera className={`${iconSizes[size]} text-white`} />
                      )}
                    </div>
                  )}

                  {/* Drag Active Overlay */}
                  {isImageDragActive && !disabled && (
                    <div className="bg-primary/20 ring-primary absolute inset-0 flex items-center justify-center rounded-lg ring-2">
                      <Upload className={`${iconSizes[size]} text-primary`} />
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div className="text-center">
                  <p className="font-medium">
                    {value || imagePreview
                      ? changeText || t('common.changeImage')
                      : uploadText || t('common.uploadImage')}
                  </p>
                  <p className="text-xs">
                    {helpText || t('common.imageUploadHelp')}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Image Preview Dialog */}
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <div className="hidden" />
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="flex max-h-[95vh] max-w-[95vw] min-w-full items-center justify-center border-0 bg-transparent p-0 shadow-none select-none"
            >
              <div className="relative flex h-full w-full items-center justify-center">
                <div
                  ref={dialogContentRef}
                  className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900"
                >
                  <img
                    src={imagePreview || value || undefined}
                    alt="Image preview"
                    className="h-auto max-h-[85vh] w-auto max-w-[85vw] object-contain"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/20 p-0 text-white backdrop-blur-sm hover:bg-black/40"
                    onClick={() => setIsPreviewOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>

                  {/* Image info overlay */}
                  {(imagePreview || value) && (
                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                      <div className="text-white">
                        <p className="text-lg font-medium">
                          {previewTitle || t('common.imagePreview')}
                        </p>
                        <p className="text-sm opacity-80">
                          {previewSubtitle ||
                            t('common.imagePreviewDescription')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </FormItem>
  );
}
