import { useTranslation } from 'react-i18next';

import { useCurriculumsContext } from '../../CurriculumsContext';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export function CurriculumsViewDialog() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog } = useCurriculumsContext();

  if (!currentRow) return null;

  return (
    <Dialog
      open
      onOpenChange={() => {
        setOpenedDialog(null);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{currentRow.name}</DialogTitle>
          <DialogDescription>
            {t('curriculums.viewDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t('curriculums.viewDialog.basicInfo')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('curriculums.table.curriculumName')}
                </label>
                <p className="text-sm">{currentRow.name}</p>
              </div>
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  {t('curriculums.table.subject')}
                </label>
                <p className="text-sm">{currentRow.subject.name}</p>
              </div>
              {currentRow.description && (
                <div className="col-span-2">
                  <label className="text-muted-foreground text-sm font-medium">
                    {t('curriculums.table.description')}
                  </label>
                  <p className="text-sm">{currentRow.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Lessons */}
          {currentRow.lessons && currentRow.lessons.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  {t('curriculums.viewDialog.lessons')}
                </h3>
                <div className="space-y-3">
                  {currentRow.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-start justify-between rounded-md border p-3"
                    >
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {t('curriculums.viewDialog.lessonNumber', {
                              number: index + 1,
                            })}
                          </Badge>
                          <h4 className="font-medium">{lesson.name}</h4>
                        </div>
                        {lesson.description && (
                          <p className="text-muted-foreground mt-1 text-sm">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Statistics */}
          <Separator />
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              {t('curriculums.viewDialog.statistics')}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-md border p-3 text-center">
                <div className="text-2xl font-bold">
                  {currentRow.lessons?.length || 0}
                </div>
                <div className="text-muted-foreground text-sm">
                  {t('curriculums.viewDialog.totalLessons')}
                </div>
              </div>
              <div className="rounded-md border p-3 text-center">
                <div className="text-2xl font-bold">
                  {currentRow.subject.name}
                </div>
                <div className="text-muted-foreground text-sm">
                  {t('curriculums.viewDialog.subjectName')}
                </div>
              </div>
              <div className="rounded-md border p-3 text-center">
                <div className="text-2xl font-bold">
                  {new Date(currentRow.createdAt).getFullYear()}
                </div>
                <div className="text-muted-foreground text-sm">
                  {t('curriculums.viewDialog.createdYear')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
