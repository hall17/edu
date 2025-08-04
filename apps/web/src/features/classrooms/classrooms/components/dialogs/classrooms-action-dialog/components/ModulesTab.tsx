import { MODULE_CODES, ModuleCode } from '@edusama/common';
import { useQuery } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormData } from '../ClassroomsActionDialog';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { TabsContent } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';

interface ModulesTabProps {
  form: UseFormReturn<FormData>;
}

const selectableModules: ModuleCode[] = [
  MODULE_CODES.certificates,
  MODULE_CODES.assessment,
  MODULE_CODES.assignments,
  MODULE_CODES.recordedLiveClasses,
  MODULE_CODES.attendance,
  MODULE_CODES.materials,
];

export function ModulesTab({ form }: ModulesTabProps) {
  const { t } = useTranslation();

  const modulesQuery = useQuery(
    trpc.module.findAll.queryOptions({
      codes: selectableModules,
      branchModules: true,
    })
  );

  return (
    <TabsContent value="modules" className="space-y-2">
      <FormField
        control={form.control}
        name="moduleIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              {t('classrooms.actionDialog.fields.modules')}
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                {modulesQuery.data?.modules?.map((module: any) => {
                  const isAvailable =
                    'branches' in module &&
                    module.branches.length > 0 &&
                    module.branches.some(
                      (branch: any) => branch.status === 'ACTIVE'
                    );
                  const isSelected = field.value?.includes(module.id) || false;
                  const moduleDescription = t(
                    `moduleDescriptions.${module.code}`,
                    ''
                  );
                  console.log('isAvailable', isAvailable, module.branches);
                  return (
                    <Card
                      key={module.id}
                      className={`relative py-4 transition-all duration-200 ${
                        !isAvailable
                          ? 'border-muted-foreground/20 opacity-70'
                          : isSelected
                            ? 'border-l-4 border-l-green-500'
                            : 'hover:shadow-md'
                      }`}
                    >
                      <CardHeader className="py-0">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <CardTitle className="text-base">
                              {t(`moduleNames.${module.code as ModuleCode}`)}
                            </CardTitle>
                            {moduleDescription && (
                              <CardDescription className="mt-1 hidden text-sm md:block">
                                {moduleDescription}
                              </CardDescription>
                            )}
                          </div>
                        </div>

                        <CardAction className="flex flex-col items-end gap-2">
                          <Switch
                            disabled={!isAvailable}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([
                                  ...(field.value || []),
                                  module.id,
                                ]);
                              } else {
                                field.onChange(
                                  field.value?.filter(
                                    (id: number) => id !== module.id
                                  ) || []
                                );
                              }
                            }}
                            size="md"
                            className="data-[state=checked]:bg-green-500"
                          />
                          {!isAvailable && (
                            <div className="space-y-2 text-right">
                              <Badge variant="destructive">
                                {t(
                                  'classrooms.actionDialog.moduleNotAvailable'
                                )}
                              </Badge>
                              <p className="text-muted-foreground text-xs">
                                {t(
                                  'classrooms.actionDialog.moduleNotAvailableDesc'
                                )}
                              </p>
                            </div>
                          )}
                        </CardAction>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );
}
