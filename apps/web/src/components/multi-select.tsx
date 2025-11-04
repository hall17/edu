/**
 * Exact copy of the MultiSelect component from WDS with some minor changes to the styles.
 * https://wds-shadcn-registry.netlify.app/components/multi-select/
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

import { Button, buttonVariants } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const multiSelectBadgeVariants = cva('', {
  variants: {
    size: {
      xxs: '[&_.badge]:gap-0.5 [&_.badge]:px-1 [&_.badge]:py-0 [&_.badge]:text-xs',
      xs: '[&_.badge]:gap-1 [&_.badge]:px-1.5 [&_.badge]:py-0.5 [&_.badge]:text-xs',
      sm: '[&_.badge]:gap-1 [&_.badge]:px-1.5 [&_.badge]:py-0.5 [&_.badge]:text-xs',
      default:
        '[&_.badge]:gap-1 [&_.badge]:px-2 [&_.badge]:py-1 [&_.badge]:text-sm',
      lg: '[&_.badge]:gap-1.5 [&_.badge]:px-2.5 [&_.badge]:py-1 [&_.badge]:text-sm',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type MultiSelectContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedValues: Set<string>;
  toggleValue: (value: string) => void;
  items: Map<string, ReactNode>;
  onItemAdded: (value: string, label: ReactNode) => void;
  size?: VariantProps<typeof buttonVariants>['size'];
};
const MultiSelectContext = createContext<MultiSelectContextType | null>(null);

export function MultiSelect({
  children,
  values,
  defaultValues,
  onValuesChange,
  size,
}: {
  children: ReactNode;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  size?: VariantProps<typeof buttonVariants>['size'];
}) {
  const [open, setOpen] = useState(false);
  const [internalValues, setInternalValues] = useState(
    new Set<string>(values ?? defaultValues)
  );
  const selectedValues = values ? new Set(values) : internalValues;
  const [items, setItems] = useState<Map<string, ReactNode>>(new Map());

  function toggleValue(value: string) {
    const getNewSet = (prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    };
    setInternalValues(getNewSet);
    onValuesChange?.([...getNewSet(selectedValues)]);
  }

  const onItemAdded = useCallback((value: string, label: ReactNode) => {
    setItems((prev) => {
      if (prev.get(value) === label) return prev;
      return new Map(prev).set(value, label);
    });
  }, []);

  return (
    <MultiSelectContext
      value={{
        open,
        setOpen,
        selectedValues,
        toggleValue,
        items,
        onItemAdded,
        size,
      }}
    >
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        {children}
      </Popover>
    </MultiSelectContext>
  );
}

export function MultiSelectTrigger({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: ReactNode;
} & ComponentPropsWithoutRef<typeof Button>) {
  const { open, size } = useMultiSelectContext();

  return (
    <PopoverTrigger asChild>
      <Button
        {...props}
        size={props.size ?? size}
        variant={props.variant ?? 'outline'}
        role={props.role ?? 'combobox'}
        aria-expanded={props['aria-expanded'] ?? open}
        className={cn(
          'border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*="text-"])]:text-muted-foreground flex h-auto w-fit items-center justify-between gap-2 overflow-hidden rounded-md border bg-transparent whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
          multiSelectBadgeVariants({
            size: (() => {
              const currentSize = props.size ?? size;
              if (currentSize && !String(currentSize).startsWith('icon')) {
                return currentSize as 'xxs' | 'xs' | 'sm' | 'default' | 'lg';
              }
              return 'default';
            })(),
          }),
          className
        )}
      >
        {children}
        <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  );
}

export function MultiSelectValue({
  placeholder,
  clickToRemove = true,
  className,
  overflowBehavior = 'wrap-when-open',
  ...props
}: {
  placeholder?: string;
  clickToRemove?: boolean;
  overflowBehavior?: 'wrap' | 'wrap-when-open' | 'cutoff';
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>) {
  const { selectedValues, toggleValue, items, open } = useMultiSelectContext();
  const [overflowAmount, setOverflowAmount] = useState(0);
  const valueRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);

  const shouldWrap =
    overflowBehavior === 'wrap' ||
    (overflowBehavior === 'wrap-when-open' && open);

  const checkOverflow = useCallback(() => {
    if (valueRef.current == null) return;

    const containerElement = valueRef.current;
    const overflowElement = overflowRef.current;
    const items = containerElement.querySelectorAll<HTMLElement>(
      '[data-selected-item]'
    );

    if (overflowElement != null) overflowElement.style.display = 'none';
    items.forEach((child) => child.style.removeProperty('display'));
    let amount = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      const child = items[i]!;
      if (containerElement.scrollWidth <= containerElement.clientWidth) {
        break;
      }
      amount = items.length - i;
      child.style.display = 'none';
      overflowElement?.style.removeProperty('display');
    }
    setOverflowAmount(amount);
  }, []);

  const handleResize = useCallback(
    (node: HTMLDivElement) => {
      valueRef.current = node;

      const observer = new ResizeObserver(checkOverflow);
      observer.observe(node);

      return () => {
        observer.disconnect();
        valueRef.current = null;
      };
    },
    [checkOverflow]
  );

  if (selectedValues.size === 0 && placeholder) {
    return (
      <span className="text-muted-foreground min-w-0 overflow-hidden font-normal">
        {placeholder}
      </span>
    );
  }

  return (
    <div
      {...props}
      ref={handleResize}
      className={cn(
        'flex w-fit gap-1.5 overflow-hidden',
        shouldWrap && 'h-full',
        className
      )}
    >
      {[...selectedValues]
        .filter((value) => items.has(value))
        .map((value) => (
          <Badge
            variant="secondary"
            data-selected-item
            className="badge bg-border/60 flex items-center gap-1"
            key={value}
          >
            {items.get(value)}
            {clickToRemove && (
              <div
                className="group"
                onClick={
                  clickToRemove
                    ? (e) => {
                        e.stopPropagation();
                        toggleValue(value);
                      }
                    : undefined
                }
              >
                <XIcon className="text-muted-foreground group-hover:text-destructive size-3.5" />
              </div>
            )}
          </Badge>
        ))}
      <Badge
        style={{
          display: overflowAmount > 0 && !shouldWrap ? 'block' : 'none',
        }}
        variant="outline"
        className="badge"
        ref={overflowRef}
      >
        +{overflowAmount}
      </Badge>
    </div>
  );
}

export function MultiSelectContent({
  search = true,
  children,
  ...props
}: {
  search?: boolean | { placeholder?: string; emptyMessage?: string };
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<typeof Command>, 'children'>) {
  const canSearch = typeof search === 'object' ? true : search;

  return (
    <>
      <div style={{ display: 'none' }}>
        <Command>
          <CommandList>{children}</CommandList>
        </Command>
      </div>
      <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-0">
        <Command {...props}>
          {canSearch ? (
            <CommandInput
              placeholder={
                typeof search === 'object' ? search.placeholder : undefined
              }
            />
          ) : (
            <button autoFocus className="sr-only" />
          )}
          <CommandList>
            {canSearch && (
              <CommandEmpty>
                {typeof search === 'object' ? search.emptyMessage : undefined}
              </CommandEmpty>
            )}
            {children}
          </CommandList>
        </Command>
      </PopoverContent>
    </>
  );
}

export function MultiSelectItem({
  value,
  children,
  badgeLabel,
  onSelect,
  ...props
}: {
  badgeLabel?: ReactNode;
  value: string;
} & Omit<ComponentPropsWithoutRef<typeof CommandItem>, 'value'>) {
  const { toggleValue, selectedValues, onItemAdded } = useMultiSelectContext();
  const isSelected = selectedValues.has(value);

  useEffect(() => {
    onItemAdded(value, badgeLabel ?? children);
  }, [value, children, onItemAdded, badgeLabel]);

  return (
    <CommandItem
      {...props}
      onSelect={() => {
        toggleValue(value);
        onSelect?.(value);
      }}
    >
      <CheckIcon
        className={cn('mr-2 size-4', isSelected ? 'opacity-100' : 'opacity-0')}
      />
      {children}
    </CommandItem>
  );
}

export function MultiSelectGroup(
  props: ComponentPropsWithoutRef<typeof CommandGroup>
) {
  return <CommandGroup {...props} />;
}

export function MultiSelectSeparator(
  props: ComponentPropsWithoutRef<typeof CommandSeparator>
) {
  return <CommandSeparator {...props} />;
}

function useMultiSelectContext() {
  const context = useContext(MultiSelectContext);
  if (context == null) {
    throw new Error(
      'useMultiSelectContext must be used within a MultiSelectContext'
    );
  }
  return context;
}
