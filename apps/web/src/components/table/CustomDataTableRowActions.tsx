import React from 'react';

import { Button } from '../ui/button';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Props {
  items: {
    tooltip?: React.ReactNode;
    content?: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hidden?: boolean;
  }[];
}

export function CustomDataTableRowActions({ items }: Props) {
  const visible = items.filter((item) => !item.hidden);

  return (
    <div className="flex items-center justify-end gap-2">
      {visible.map((item) => {
        const content = item.content ?? (
          <Button
            variant="ghost"
            className={cn('flex h-8 w-8 p-0', item.className)}
            onClick={item.onClick}
          >
            {item.icon}
          </Button>
        );

        if (item.tooltip) {
          return (
            <Tooltip>
              <TooltipTrigger asChild>{content}</TooltipTrigger>
              <TooltipContent>{item.tooltip}</TooltipContent>
            </Tooltip>
          );
        }

        return content;
      })}
    </div>
  );
}
