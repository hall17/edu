import { ModuleCode } from '@edusama/common';
import { TFunction } from 'i18next';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface Module {
  id: number;
  code: ModuleCode;
  branches?: Array<{ status: string }>;
}

interface ModuleCardProps {
  module: Module;
  isSelected: boolean;
  isAvailable: boolean;
  onToggle: (checked: boolean) => void;
  t: TFunction;
}

export function ModuleCard({
  module,
  isSelected,
  isAvailable,
  onToggle,
  t,
}: ModuleCardProps) {
  const moduleDescription = t(`moduleDescriptions.${module.code}`, '');

  return (
    <Card
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
              {t(`moduleNames.${module.code}`)}
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
            onCheckedChange={onToggle}
            size="md"
            className="data-[state=checked]:bg-green-500"
          />
          {!isAvailable && (
            <div className="space-y-2 text-right">
              <Badge variant="destructive">
                {t('classrooms.actionDialog.moduleNotAvailable')}
              </Badge>
              <p className="text-muted-foreground text-xs">
                {t('classrooms.actionDialog.moduleNotAvailableDesc')}
              </p>
            </div>
          )}
        </CardAction>
      </CardHeader>
    </Card>
  );
}
