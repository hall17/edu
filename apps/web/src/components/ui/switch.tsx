import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  size?: 'sm' | 'md' | 'lg';
}

function Switch({ className, size = 'md', ...props }: SwitchProps) {
  const sizeClasses = {
    sm: {
      root: 'h-[1rem] w-7',
      thumb: 'size-3.5 data-[state=checked]:translate-x-[calc(100%-2px)]',
    },
    md: {
      root: 'h-[1.15rem] w-8',
      thumb: 'size-4 data-[state=checked]:translate-x-[calc(100%-2px)]',
    },
    lg: {
      root: 'h-6 w-10',
      thumb: 'size-5 data-[state=checked]:translate-x-[calc(100%-2px)]',
    },
  };

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        sizeClasses[size].root,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform data-[state=unchecked]:translate-x-0',
          sizeClasses[size].thumb
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
