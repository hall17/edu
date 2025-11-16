import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useUnitsContext } from '../UnitsContext';

import { LoadingButton } from '@/components';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import {
  UnitCreateDto,
  unitCreateSchema,
  UnitUpdateDto,
  unitUpdateSchema,
} from '@edusama/common';

type UnitForm = UnitCreateDto | UnitUpdateDto;

export function UnitsActionDialog() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog, openedDialog, createUnit, updateUnit } =
    useUnitsContext();

  const createUnitMutation = useMutation(trpc.unit.create.mutationOptions());
  const updateUnitMutation = useMutation(trpc.unit.update.mutationOptions());
  const isLoading =
    createUnitMutation.isPending || updateUnitMutation.isPending;

  const isEditMode = !!currentRow;

  const defaultValues = useMemo(() => {
    if (isEditMode && currentRow) {
      return {
        id: currentRow.id,
        name: currentRow.name,
        description: currentRow.description ?? '',
      };
    }
    return {
      name: '',
      description: '',
    };
  }, [currentRow]);

  const schema = isEditMode ? unitUpdateSchema : unitCreateSchema;

  const form = useForm<UnitForm>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  async function onSubmit(data: UnitForm) {
    try {
      if ('id' in data) {
        const updatedUnit = await updateUnitMutation.mutateAsync(data);

        updateUnit(updatedUnit as any);
        toast.success(t('subjects.units.updateSuccess'));
      } else {
        const newUnit = await createUnitMutation.mutateAsync(data);

        createUnit(newUnit as any);
        toast.success(t('subjects.units.createSuccess'));
      }

      setOpenedDialog(null);
      form.reset();
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? t('subjects.units.editTitle')
              : t('subjects.units.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t('subjects.units.editDescription')
              : t('subjects.units.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('subjects.units.namePlaceholder')}
                      {...field}
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
                  <FormLabel>{t('common.description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('subjects.units.descriptionPlaceholder')}
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenedDialog(null)}
              >
                {t('common.cancel')}
              </Button>
              <LoadingButton type="submit" isLoading={isLoading}>
                {isEditMode ? t('common.update') : t('common.create')}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
