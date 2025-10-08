import { ModuleCode, Permission } from '@edusama/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoleStatus } from '@edusama/server';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InfoIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useRolesContext } from '../../RolesContext';

import { LoadingButton } from '@/components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { trpc } from '@/lib/trpc';

export function RolesActionDialog() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const {
    openedDialog,
    currentRow,
    setOpenedDialog,
    createRole,
    updateRole,
    setCurrentRow,
  } = useRolesContext();

  const isEdit = openedDialog === 'edit' && currentRow;
  const isOpen = openedDialog === 'create' || openedDialog === 'edit';
  const [activeTab, setActiveTab] = useState('general');

  const formSchema = z.object({
    name: z.string().min(1).max(50),
    code: z.string().optional(),
    description: z.string().optional(),
    status: z.nativeEnum(RoleStatus).optional(),
    isVisible: z.boolean().optional(),
    permissionIds: z.array(z.uuid()).optional(),
  });

  type RoleForm = z.infer<typeof formSchema>;

  const defaultValues: RoleForm = isEdit
    ? {
        name: currentRow.name ?? '',
        code: currentRow.code ?? undefined,
        description: currentRow.description ?? undefined,
        status: currentRow.status ?? RoleStatus.ACTIVE,
        isVisible: currentRow.isVisible ?? true,
        permissionIds: currentRow.permissions.map((p) => p.permissionId),
      }
    : {
        name: '',
        status: RoleStatus.ACTIVE,
        permissionIds: [],
      };

  const form = useForm<RoleForm>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const watchedPermissionIds = form.watch('permissionIds');

  // Role mutations
  const createMutation = useMutation(trpc.role.create.mutationOptions());
  const updateMutation = useMutation(trpc.role.update.mutationOptions());

  // Permission queries and mutations
  const modulesQuery = useQuery(
    trpc.module.findAll.queryOptions({ all: true })
  );

  // const { data: permissionsData } = useQuery(
  //   trpc.permission.findAll.queryOptions({ all: true })
  // );

  const assignPermissionsMutation = useMutation(
    trpc.permission.assignToRole.mutationOptions()
  );
  const removePermissionsMutation = useMutation(
    trpc.permission.removeFromRole.mutationOptions()
  );

  const modules = modulesQuery?.data?.modules ?? [];

  const onSubmit = async (values: RoleForm) => {
    try {
      if (isEdit && currentRow) {
        const result = await updateMutation.mutateAsync({
          ...values,
          id: currentRow.id,
        });
        updateRole(result);
        toast.success(t('roles.messages.updateSuccess'));
      } else {
        const result = await createMutation.mutateAsync(values);
        createRole(result);
        setCurrentRow(result);
        toast.success(t('roles.messages.createSuccess'));
      }

      handleClose();
    } catch (error) {
      toast.error(
        isEdit
          ? t('roles.messages.updateError')
          : t('roles.messages.createError')
      );
    }
  };

  const handlePermissionToggle = async (
    permissionId: string,
    isAssigned: boolean
  ) => {
    if (!currentRow) return;

    try {
      if (isAssigned) {
        await removePermissionsMutation.mutateAsync({
          roleId: currentRow.id,
          permissionIds: [permissionId],
        });
        toast.success(t('roles.permissions.messages.removeSuccess'));
      } else {
        await assignPermissionsMutation.mutateAsync({
          roleId: currentRow.id,
          permissionIds: [permissionId],
        });
        toast.success(t('roles.permissions.messages.assignSuccess'));
      }

      queryClient.invalidateQueries({
        queryKey: trpc.permission.findByRole.queryKey({
          id: currentRow.id,
        }),
      });
    } catch (error) {
      toast.error(
        isAssigned
          ? t('roles.permissions.messages.removeError')
          : t('roles.permissions.messages.assignError')
      );
    }
  };

  const handlePermissionCheckboxChange = (
    permissionId: string,
    permissionName: string,
    checked: boolean
  ) => {
    const currentPermissionIds = form.getValues('permissionIds') || [];

    if (checked) {
      const newPermissionIds = [...currentPermissionIds, permissionId];

      // If write or delete is selected, also select read
      if (permissionName === 'write' || permissionName === 'delete') {
        // Find the read permission for this module
        const module = modules.find((m) =>
          m.permissions.some((p) => p.id === permissionId)
        );
        const readPermission = module?.permissions.find(
          (p) => p.name === 'read'
        );

        if (
          readPermission &&
          !currentPermissionIds.includes(readPermission.id)
        ) {
          newPermissionIds.push(readPermission.id);
        }
      }

      form.setValue('permissionIds', newPermissionIds);
    } else {
      // When deselecting, only remove the current permission
      // Don't remove read permission even if write/delete is deselected
      const newPermissionIds = currentPermissionIds.filter(
        (id) => id !== permissionId
      );
      form.setValue('permissionIds', newPermissionIds);
    }
  };

  const handleClose = () => {
    setOpenedDialog(null);
    form.reset();
  };

  const getDialogTitle = () => {
    return isEdit ? t('roles.editTitle') : t('roles.createTitle');
  };

  const getDialogDescription = () => {
    return isEdit ? t('roles.editDescription') : t('roles.createDescription');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="roles-action-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">
                  {t('roles.tabs.general')}
                </TabsTrigger>
                <TabsTrigger value="permissions">
                  {t('roles.tabs.permissions')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('roles.form.name')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('roles.form.placeholders.name')}
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
                      <FormLabel>{t('roles.form.description')}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t('roles.form.placeholders.description')}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <FormLabel>{t('roles.form.active')}</FormLabel>
                        </div>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          {currentRow?.isSystem && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoIcon className="text-muted-foreground size-4.5" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t('roles.form.systemRoleTooltip')}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <Switch
                            disabled={currentRow?.isSystem}
                            checked={field.value === RoleStatus.ACTIVE}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                checked
                                  ? RoleStatus.ACTIVE
                                  : RoleStatus.SUSPENDED
                              );
                            }}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                {!isEdit && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center gap-2">
                      <InfoIcon className="h-4 w-4 text-blue-600" />
                      <p className="text-sm text-blue-800">
                        {t('roles.form.permissionsCreateNote' as any)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="max-h-[60vh] space-y-4 overflow-y-auto">
                  {modules.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      {t('roles.permissions.noModulesAvailable' as any)}
                    </div>
                  ) : (
                    modules.map((module) => {
                      if (module.permissions.length === 0) return null;

                      const isFullySelected = module.permissions.every(
                        (permission) =>
                          watchedPermissionIds?.includes(permission.id)
                      );

                      return (
                        <Card key={module.id}>
                          <CardHeader>
                            <CardTitle className="text-base">
                              {t(`moduleNames.${module.code as ModuleCode}`)}
                            </CardTitle>
                            {module.description && (
                              <p className="text-sm text-gray-600">
                                {t(
                                  `moduleDescriptions.${module.code as ModuleCode}`
                                )}
                              </p>
                            )}
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-24">
                                    {t('roles.permissions.permission' as any)}
                                  </TableHead>
                                  {module.permissions.map((permission) => (
                                    <TableHead
                                      key={permission.id}
                                      className="text-center"
                                    >
                                      {t(
                                        `permissionNames.${permission.name as Permission}`
                                      )}
                                    </TableHead>
                                  ))}
                                  <TableHead className="border-l-2 text-center">
                                    {t('roles.permissions.fullAccess')}
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    {t('roles.permissions.access')}
                                  </TableCell>
                                  {module.permissions.map((permission) => {
                                    const isAssigned =
                                      watchedPermissionIds?.includes(
                                        permission.id
                                      );

                                    // Check if read should be disabled (if write or delete is selected for this module)
                                    const isReadDisabled =
                                      permission.name === 'read' &&
                                      (watchedPermissionIds?.some((id) => {
                                        const perm = module.permissions.find(
                                          (p) => p.id === id
                                        );
                                        return (
                                          perm &&
                                          (perm.name === 'write' ||
                                            perm.name === 'delete')
                                        );
                                      }) ||
                                        false);

                                    return (
                                      <TableCell
                                        key={permission.id}
                                        className="text-center"
                                      >
                                        <Checkbox
                                          checked={isAssigned}
                                          onCheckedChange={(checked) => {
                                            handlePermissionCheckboxChange(
                                              permission.id,
                                              permission.name,
                                              checked as boolean
                                            );
                                          }}
                                          disabled={
                                            assignPermissionsMutation.isPending ||
                                            removePermissionsMutation.isPending ||
                                            isReadDisabled
                                          }
                                        />
                                      </TableCell>
                                    );
                                  })}
                                  <TableCell className="border-l-2 text-center">
                                    <Checkbox
                                      checked={isFullySelected}
                                      onCheckedChange={(checked) => {
                                        const permissionIds =
                                          form.getValues('permissionIds') || [];
                                        if (checked) {
                                          const newPermissionIds = new Set([
                                            ...permissionIds,
                                            ...module.permissions.map(
                                              (p) => p.id
                                            ),
                                          ]);

                                          // If module has write or delete permissions, ensure read is also selected
                                          const hasWriteOrDelete =
                                            module.permissions.some(
                                              (p) =>
                                                p.name === 'write' ||
                                                p.name === 'delete'
                                            );
                                          if (hasWriteOrDelete) {
                                            const readPermission =
                                              module.permissions.find(
                                                (p) => p.name === 'read'
                                              );
                                            if (readPermission) {
                                              newPermissionIds.add(
                                                readPermission.id
                                              );
                                            }
                                          }

                                          form.setValue('permissionIds', [
                                            ...newPermissionIds,
                                          ]);
                                        } else {
                                          const newPermissionIds =
                                            permissionIds.filter(
                                              (id: string) =>
                                                !module.permissions.some(
                                                  (p) => p.id === id
                                                )
                                            );
                                          form.setValue(
                                            'permissionIds',
                                            newPermissionIds
                                          );
                                        }
                                      }}
                                      disabled={
                                        assignPermissionsMutation.isPending ||
                                        removePermissionsMutation.isPending
                                      }
                                    />
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <LoadingButton
            type="submit"
            form="roles-action-form"
            isLoading={createMutation.isPending || updateMutation.isPending}
          >
            {isEdit ? t('common.saveChanges') : t('common.create')}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
