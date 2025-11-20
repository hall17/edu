import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';
// import ReactPlayer from 'react-player';
import ReactPlayer from 'react-player/lazy';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LessonMaterial } from '@/features/admin/subjects/subject-details/SubjectDetailsContext';

import MuxPlayer from '@mux/mux-player-react/lazy';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface MaterialViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: LessonMaterial | null;
}

export function MaterialViewerDialog({
  open,
  onOpenChange,
  material,
}: MaterialViewerDialogProps) {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setIsLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const isPDF = material?.extension?.match(/\.(pdf)$/i);
  const isPowerPoint =
    material?.extension === 'ppt' || material?.extension === 'pptx';
  const isWord =
    material?.extension === 'doc' || material?.extension === 'docx';
  const isVideo = material?.type === 'VIDEO';
  const isAudio = material?.type === 'AUDIO';

  // Check if file needs Office viewer (PowerPoint or Word)
  const needsOfficeViewer = isPowerPoint || isWord;

  const renderContent = () => {
    if (!material) return null;

    if (isPDF) {
      return (
        <div className="flex flex-col items-center space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
          )}
          <Document
            file={material.url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
              </div>
            }
            className="max-w-full"
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="max-w-full shadow-[0_0_8px_rgba(0,0,0,0.2)]"
            />
          </Document>
          {numPages > 0 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={previousPage}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <p className="text-sm">
                {t('materials.viewer.page')} {pageNumber} / {numPages}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={pageNumber >= numPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (needsOfficeViewer) {
      // Use Microsoft Office Online viewer for PowerPoint and Word files
      // This prevents downloading and allows viewing only
      const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(material.url)}`;

      return (
        <div className="flex h-full w-full items-center justify-center">
          <iframe
            src={viewerUrl}
            className="h-[70vh] w-full border-0"
            title={material.name}
          />
        </div>
      );
    }

    if (isVideo || isAudio) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          {/* <ReactPlayer
            src={material.url}
            controls={true}
            width="100%"
            height="100%"
            playing={false}
            crossOrigin="use-credentials"
            config={{
              file: {
                hlsOptions: {
                  xhrSetup: function (xhr, url) {
                    console.log('xhrSetup', url);
                    xhr.withCredentials = true; // send cookies
                  },
                },
              },
              // hls: {
              //   xhrSetup: function (xhr, url) {
              //     console.log('xhrSetup', url);
              //     xhr.withCredentials = true; // send cookies
              //   },
              //   debug: true,
              // },
            }}
          /> */}
          <MuxPlayer
            debug
            playsInline
            streamType="on-demand"
            src="https://cdn.edusama.com/hls/output-folder/video2/master.m3u8"
            crossOrigin="use-credentials"
            _hlsConfig={{
              debug: true,
              // xhrSetup: function (xhr, url) {
              //   console.log('xhrSetup', url);
              //   xhr.withCredentials = true; // send cookies
              // },
              // fetchSetup: function (url, options) {
              //   console.log('fetchSetup', url, options);
              //   options.credentials = 'include'; // send cookies
              //   return fetch(url, options);
              // },
            }}
          />
          {/* <ReactHlsPlayer
            playerRef={playerRef}
            src="https://cdn.edusama.com/hls/output-folder/video2/master.m3u8"
            autoPlay={false}
            controls={true}
            width="100%"
            height="auto"
            getHLSRef={(config) => {
              console.log('config', config);
            }}
            hlsConfig={
              {
                xhrSetup: function (xhr, url) {
                  console.log('xhrSetup', url);
                  xhr.withCredentials = true; // send cookies
                },
              } as HlsConfig
            }
          /> */}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground text-sm">
          {t('materials.viewer.unsupportedType')}
        </p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] min-h-[90vh] min-w-[90vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{material?.name}</DialogTitle>
          {material?.description && (
            <p className="text-muted-foreground text-sm">
              {material.description}
            </p>
          )}
        </DialogHeader>
        <div className="mt-4">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}
