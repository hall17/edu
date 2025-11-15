import { useMutation } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useUnitsContext } from '../UnitsContext';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { trpc } from '@/lib/trpc';

export function UnitsDeleteDialog() {
  const { t } = useTranslation();
  const { deleteUnit, currentRow, setOpenedDialog } = useUnitsContext();

  const deleteUnitMutation = useMutation(trpc.unit.delete.mutationOptions());

  async function handleDelete() {
    try {
      await deleteUnitMutation.mutateAsync({
        id: currentRow.id,
      });

      deleteUnit(currentRow.id);
      toast.success(t('subjects.units.deleteSuccess'));

      setOpenedDialog(null);
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <ConfirmDialog
      open
      onOpenChange={() => setOpenedDialog(null)}
      handleConfirm={handleDelete}
      isLoading={deleteUnitMutation.isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{' '}
          {t('subjects.units.deleteTitle')}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            {t('subjects.units.deleteConfirmation')}{' '}
            <span className="font-bold">{currentRow?.name}</span>?
          </p>

          <Alert variant="destructive">
            <AlertTitle>{t('dialogs.delete.warningTitle')}</AlertTitle>
            <AlertDescription>
              {t('subjects.units.deleteWarning')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('dialogs.delete.confirmButtonText')}
      destructive
    />
  );
}
