import { ModuleCode, Permission } from '@edusama/common';
import { RoleStatus } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useRolesContext } from '../../RolesContext';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { trpc } from '@/lib/trpc';
import { getStatusBadgeVariant } from '@/utils';

export function RolesViewDialog() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog } = useRolesContext();

  const modulesQuery = useQuery(
    trpc.module.findAll.queryOptions({ all: true })
  );

  const modules = modulesQuery?.data?.modules ?? [];

  const handleClose = () => {
    setOpenedDialog(null);
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t('roles.viewTitle')}</DialogTitle>
          <DialogDescription>{t('roles.viewDescription')}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="mb-4 text-lg font-medium">
                {t('roles.viewDialog.basicInfo')}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      {t('common.name')}
                    </label>
                    <p className="text-sm font-medium">{currentRow.name}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      {t('common.status')}
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant={getStatusBadgeVariant(currentRow.status)}
                        className="capitalize"
                      >
                        {t(`roleStatuses.${currentRow.status}`)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {currentRow.description && (
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      {t('common.description')}
                    </label>
                    <p className="text-sm">{currentRow.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      {t('roles.viewDialog.roleType' as any)}
                    </label>
                    <p className="text-sm">
                      {currentRow.isSystem
                        ? t('roles.viewDialog.systemRole' as any)
                        : t('roles.viewDialog.customRole' as any)}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      {t('common.createdAt')}
                    </label>
                    <p className="text-sm">
                      {new Date(currentRow.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Permissions */}
            <div>
              <h3 className="mb-4 text-lg font-medium">
                {t('roles.tabs.permissions')}
              </h3>
              <div className="space-y-4">
                {modules.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    {t('roles.permissions.noModulesAvailable' as any)}
                  </div>
                ) : (
                  modules.map((module) => {
                    if (module.permissions.length === 0) return null;

                    const rolePermissions = currentRow.permissions || [];
                    const modulePermissions = module.permissions.filter(
                      (permission) =>
                        rolePermissions.some(
                          (rp) => rp.permissionId === permission.id
                        )
                    );

                    if (modulePermissions.length === 0) return null;

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
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">
                                  {t('roles.permissions.access')}
                                </TableCell>
                                {module.permissions.map((permission) => {
                                  const hasPermission = rolePermissions.some(
                                    (rp) => rp.permissionId === permission.id
                                  );
                                  return (
                                    <TableCell
                                      key={permission.id}
                                      className="text-center"
                                    >
                                      <Badge
                                        variant={
                                          hasPermission
                                            ? 'default'
                                            : 'secondary'
                                        }
                                      >
                                        {hasPermission ? '✓' : '✗'}
                                      </Badge>
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t('common.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
