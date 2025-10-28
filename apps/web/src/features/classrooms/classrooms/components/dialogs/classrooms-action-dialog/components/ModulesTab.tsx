import { MODULE_CODES, ModuleCode } from '@edusama/common';
import { useQuery } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormData } from '../getFormSchema';

import { ModuleCard } from '@/components/ModuleCard';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="moduleIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              {t('classrooms.actionDialog.fields.modules')}
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                {modulesQuery.data?.modules?.map((module: any) => {
                  const isAvailable =
                    'branches' in module &&
                    module.branches.length > 0 &&
                    module.branches.some(
                      (branch: any) => branch.status === 'ACTIVE'
                    );
                  const isSelected = field.value?.includes(module.id) || false;

                  return (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      isSelected={isSelected}
                      isAvailable={isAvailable}
                      onToggle={(checked) => {
                        if (checked) {
                          field.onChange([...(field.value || []), module.id]);
                        } else {
                          field.onChange(
                            field.value?.filter(
                              (id: number) => id !== module.id
                            ) || []
                          );
                        }
                      }}
                      t={t}
                    />
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
