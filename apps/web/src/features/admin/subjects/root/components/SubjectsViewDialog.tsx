import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { useSubjectsContext } from '../SubjectsContext';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getStatusBadgeVariant } from '@/utils';

export function SubjectsViewDialog() {
  const { t } = useTranslation();
  const { setOpenedDialog, currentRow } = useSubjectsContext();

  return (
    <Dialog open onOpenChange={(open) => !open && setOpenedDialog(null)}>
      <DialogContent className="max-h-[90vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('subjects.viewDialog.basicInfo')}</DialogTitle>
          <DialogDescription>
            {t('subjects.viewDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Subject Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{currentRow.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      'capitalize',
                      getStatusBadgeVariant(currentRow.status)
                    )}
                  >
                    {t(`subjectStatuses.${currentRow.status}`)}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Subject Information */}
            <div>
              <h4 className="mb-3 text-sm font-medium">
                {t('subjects.viewDialog.basicInfo')}
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('materials.addSubject.fields.name')}
                  </label>
                  <p className="text-sm">{currentRow.name}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('materials.addSubject.fields.description')}
                  </label>
                  <p className="text-sm">{currentRow.description || '-'}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Curriculums Information */}
            <div>
              <h4 className="mb-3 text-sm font-medium">
                {t('subjects.viewDialog.curriculums')}
              </h4>
              {currentRow.curriculums && currentRow.curriculums.length > 0 ? (
                <div className="space-y-3">
                  {currentRow.curriculums.map((curriculum) => (
                    <div
                      key={curriculum.id}
                      className="bg-muted/30 rounded-lg border p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium">
                            {curriculum.name}
                          </h5>
                          {curriculum.description && (
                            <p className="text-muted-foreground mt-1 text-xs">
                              {curriculum.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-4">
                            <span className="text-muted-foreground text-xs">
                              {t('common.createdAt')}:{' '}
                              {dayjs(curriculum.createdAt).format('DD/MM/YYYY')}
                            </span>
                            {curriculum.units &&
                              curriculum.units.length > 0 && (
                                <span className="text-muted-foreground text-xs">
                                  {curriculum.units.reduce(
                                    (acc, unit) => acc + unit.lessons.length,
                                    0
                                  )}{' '}
                                  {t('subjects.viewDialog.lessons')}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {t('subjects.viewDialog.noCurriculums')}
                </p>
              )}
            </div>

            <Separator />

            {/* System Information */}
            <div>
              <h4 className="mb-3 text-sm font-medium">
                {t('subjects.viewDialog.statistics')}
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('common.createdAt')}
                  </label>
                  <p className="text-sm">
                    {dayjs(currentRow.createdAt).format('DD/MM/YYYY')}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('common.lastUpdatedAt')}
                  </label>
                  <p className="text-sm">
                    {dayjs(currentRow.updatedAt).format('DD/MM/YYYY')}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('common.status')}
                  </label>
                  <p className="text-sm capitalize">
                    {t(`subjectStatuses.${currentRow.status}`)}
                  </p>
                </div>
                {currentRow.curriculums && (
                  <div>
                    <label className="text-muted-foreground text-xs font-medium">
                      {t('subjects.viewDialog.totalCurriculums')}
                    </label>
                    <p className="text-sm">{currentRow.curriculums.length}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
