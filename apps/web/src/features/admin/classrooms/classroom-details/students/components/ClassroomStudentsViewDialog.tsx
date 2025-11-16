import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { useClassroomStudentsContext } from '../ClassroomStudentsContext';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { getStatusBadgeVariant } from '@/utils';

export function ClassroomStudentsViewDialog() {
  const { t } = useTranslation();
  const { setOpenedDialog, currentRow } = useClassroomStudentsContext();
  const student = currentRow.student;

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('students.viewDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('students.viewDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('students.viewDialog.firstName')}</Label>
              <div className="text-sm">{student.firstName}</div>
            </div>
            <div className="space-y-2">
              <Label>{t('students.viewDialog.lastName')}</Label>
              <div className="text-sm">{student.lastName}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('students.viewDialog.email')}</Label>
            <div className="text-sm">{student.email}</div>
          </div>

          <div className="space-y-2">
            <Label>{t('students.viewDialog.nationalId')}</Label>
            <div className="text-sm">{student.nationalId}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('students.viewDialog.gender')}</Label>
              <div className="text-sm">
                {student.gender ? t(`genders.${student.gender}`) : '-'}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('students.viewDialog.dateOfBirth')}</Label>
              <div className="text-sm">
                {student.dateOfBirth
                  ? dayjs(student.dateOfBirth).format('DD/MM/YYYY')
                  : '-'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('students.viewDialog.status')}</Label>
            <Badge variant={getStatusBadgeVariant(currentRow.status)}>
              {t(`enrollmentStatuses.${currentRow.status}`)}
            </Badge>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpenedDialog(null)}>
            {t('common.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
