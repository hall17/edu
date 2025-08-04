import { Accept, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import { Button } from './ui/button';

interface Props {
  readonly accept: Accept;
  readonly onDrop: (acceptedFiles: File[]) => void;
  readonly maxSize?: number;
  readonly selectedFile?: File | null;
}

export function FileDroppableArea(props: Props) {
  const { t } = useTranslation();
  const dropzone = useDropzone({
    onDrop: props.onDrop,
    noClick: true,
    maxFiles: 1,
    maxSize: props.maxSize,
    accept: props.accept,
  });

  return (
    <div className="space-y-4">
      <div
        className="border-accent-border flex h-16 flex-col items-center justify-center gap-1 rounded-xl border border-dashed"
        {...dropzone.getRootProps()}
      >
        <input {...dropzone.getInputProps()} />
        <div className="text-center">
          <span>{t('fileDroppableArea.dragAndDropText')}</span>
          <Button
            className="underline"
            variant="link"
            size="sm"
            onClick={dropzone.open}
          >
            {t('fileDroppableArea.browseFromDisk')}
          </Button>
        </div>
      </div>
      {props.selectedFile && (
        <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {t('fileDroppableArea.selectedFile')}:
            </span>
            <span className="text-muted-foreground text-sm">
              {props.selectedFile.name}
            </span>
          </div>
          <span className="text-muted-foreground text-xs">
            {(props.selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      )}
    </div>
  );
}
