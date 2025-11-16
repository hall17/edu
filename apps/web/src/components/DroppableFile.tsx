import { File as FileIcon, Trash2, Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FormControl, FormItem } from '@/components/ui/form';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DroppableFileProps {
  value?: string;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
  uploadText?: string;
  changeText?: string;
  helpText?: string;
  fileTypeError?: string;
  fileSizeError?: string;
  label?: string;
}

export function DroppableFile({
  value,
  onChange,
  disabled = false,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  uploadText,
  changeText,
  helpText,
  fileTypeError,
  fileSizeError,
  label,
}: DroppableFileProps) {
  const { t } = useTranslation();

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled) return;

      const droppedFile = acceptedFiles[0];
      if (droppedFile) {
        // Validate file type if accept is specified
        if (accept) {
          const allowedTypes = Object.keys(accept).flatMap((key) =>
            key.includes('/*') ? [key.split('/')[0] + '/'] : [key]
          );

          const fileType = droppedFile.type;
          const isAllowed = allowedTypes.some((type) => {
            if (type.endsWith('/')) {
              return fileType.startsWith(type);
            }
            return fileType === type;
          });

          if (!isAllowed) {
            toast.error(fileTypeError || t('common.fileTypeError'));
            return;
          }
        }

        // Validate file size
        if (droppedFile.size > maxSize) {
          toast.error(fileSizeError || t('common.fileSizeError'));
          return;
        }

        setFile(droppedFile);
        onChange(droppedFile);
      }
    },
    [disabled, accept, maxSize, onChange, fileTypeError, fileSizeError, t]
  );

  const removeFile = useCallback(() => {
    onChange(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
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
      if (fileInputRef.current !== node) {
        (fileInputRef as any).current = node;
      }
    },
    [dropzoneInputRef]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const hasFile = file || value;

  return (
    <FormItem className="w-full" autoFocus={false}>
      {label && (
        <div className="mb-2">
          <p className="text-sm font-medium">{label}</p>
        </div>
      )}
      <div className="flex w-full flex-col gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              {...getRootProps()}
              className={`border-muted-foreground/25 hover:border-primary/50 group relative w-full cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 ${
                disabled ? 'cursor-not-allowed opacity-50' : ''
              } ${
                isDragActive && !disabled
                  ? 'ring-primary border-primary scale-[1.02] ring-2 ring-offset-2'
                  : ''
              }`}
            >
              <FormControl>
                <input
                  {...getInputProps()}
                  ref={combinedInputRef}
                  disabled={disabled}
                />
              </FormControl>

              <div className="p-6">
                {hasFile ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-primary/10 text-primary flex-shrink-0 rounded-lg p-2">
                        <FileIcon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {file?.name || value}
                        </p>
                        {file && (
                          <p className="text-muted-foreground text-xs">
                            {formatFileSize(file.size)}
                          </p>
                        )}
                      </div>
                    </div>
                    {!disabled && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="hover:text-destructive h-8 w-8 flex-shrink-0 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="bg-primary/10 text-primary rounded-full p-3">
                      {isDragActive ? (
                        <Upload className="h-6 w-6" />
                      ) : (
                        <FileIcon className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {isDragActive
                          ? t('common.dropFileHere')
                          : uploadText || t('common.uploadFile')}
                      </p>
                      {helpText && (
                        <p className="text-muted-foreground text-xs">
                          {helpText}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Drag Active Overlay */}
              {isDragActive && !disabled && (
                <div className="bg-primary/20 ring-primary absolute inset-0 flex items-center justify-center rounded-lg ring-2">
                  <Upload className="text-primary h-12 w-12" />
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="text-center">
              <p className="font-medium">
                {hasFile
                  ? changeText || t('common.changeFile')
                  : uploadText || t('common.uploadFile')}
              </p>
              {helpText && <p className="text-xs">{helpText}</p>}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </FormItem>
  );
}
