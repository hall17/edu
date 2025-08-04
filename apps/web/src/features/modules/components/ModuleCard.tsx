import { ModuleCode } from '@edusama/common';
import { ModuleStatus } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useModulesContext } from '../ModulesContext';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Module, trpcClient } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface ModuleCardProps {
  module: Module;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { addBranchOnModule, updateBranchOnModule } = useModulesContext();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'enable' | 'disable' | 'delete';
  }>({ open: false, type: 'enable' });

  // Get the branch-specific module status
  const branchModule = module.branches?.[0];
  const isAddedToBranch = !!branchModule;
  const branchModuleStatus = branchModule?.status || ModuleStatus.INACTIVE;
  const isEnabled = branchModuleStatus === ModuleStatus.ACTIVE;

  // Mutations
  const addModuleMutation = useMutation({
    mutationFn: () => trpcClient.branch.addModule.mutate({ id: module.id }),
    onSuccess: (data) => {
      addBranchOnModule(data);
      toast.success(t('modules.actions.enableSuccess'));
    },
    onError: () => {
      toast.error(t('modules.actions.enableError'));
    },
  });

  const updateModuleStatusMutation = useMutation({
    mutationFn: (status: ModuleStatus) =>
      trpcClient.branch.updateModuleStatus.mutate({
        moduleId: module.id,
        status,
      }),
    onSuccess: (data, status) => {
      updateBranchOnModule(data);
      const message =
        status === ModuleStatus.ACTIVE
          ? t('modules.actions.enableSuccess')
          : t('modules.actions.disableSuccess');
      toast.success(message);
    },
    onError: (_, status) => {
      const message =
        status === ModuleStatus.ACTIVE
          ? t('modules.actions.enableError')
          : t('modules.actions.disableError');
      toast.error(message);
    },
  });

  const handleSwitchChange = (checked: boolean) => {
    if (checked) {
      setConfirmDialog({ open: true, type: 'enable' });
    } else {
      setConfirmDialog({ open: true, type: 'disable' });
    }
  };

  const handleConfirm = () => {
    const { type } = confirmDialog;

    if (type === 'enable') {
      if (!isAddedToBranch) {
        addModuleMutation.mutate();
      } else {
        updateModuleStatusMutation.mutate(ModuleStatus.ACTIVE);
      }
    } else if (type === 'disable') {
      updateModuleStatusMutation.mutate(ModuleStatus.INACTIVE);
    }

    setConfirmDialog({ open: false, type: 'enable' });
  };

  const isLoading =
    addModuleMutation.isPending || updateModuleStatusMutation.isPending;

  const getConfirmDialogProps = () => {
    const { type } = confirmDialog;

    switch (type) {
      case 'enable':
        return {
          title: t('modules.actions.enableTitle'),
          desc: t('modules.actions.enableDesc'),
          destructive: false,
        };
      case 'disable':
        return {
          title: t('modules.actions.disableTitle'),
          desc: t('modules.actions.disableDesc'),
          destructive: false,
        };
      case 'delete':
        return {
          title: t('modules.actions.deleteTitle'),
          desc: t('modules.actions.deleteDesc'),
          destructive: true,
        };
    }
  };

  const moduleTranslation =
    t(`moduleNames.${module.code as ModuleCode}`) ?? module.name;

  return (
    <>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* Module Icon/Image */}
            <div className="bg-primary/10 text-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-lg">
              <div className="text-2xl font-bold">
                {moduleTranslation.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Module Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold">
                    {moduleTranslation}
                  </h3>
                  {module.description && (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                      {t(`moduleDescriptions.${module.code as ModuleCode}`)}
                    </p>
                  )}
                </div>

                {/* Controls */}
                <div className="ml-4 flex shrink-0 items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      {isEnabled
                        ? t('modules.card.enabled')
                        : t('modules.card.disabled')}
                    </span>
                    <Switch
                      className={cn(
                        isEnabled && 'data-[state=checked]:bg-green-500'
                      )}
                      size="lg"
                      checked={isEnabled}
                      onCheckedChange={handleSwitchChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="mt-3 flex items-center gap-2">
                {module.isDefault && (
                  <Badge variant="outline" className="text-xs">
                    {t('modules.card.default')}
                  </Badge>
                )}
                {branchModule?.expiresAt && (
                  <Badge variant="secondary" className="text-xs">
                    {t('modules.card.expiresAt')}:{' '}
                    {dayjs(branchModule.expiresAt).format('DD/MM/YYYY')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        handleConfirm={handleConfirm}
        isLoading={isLoading}
        {...getConfirmDialogProps()}
      />
    </>
  );
}
