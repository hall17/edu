import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, ChevronRight, Laptop, Moon, Sun } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useSidebarData } from './layout/data/useSidebarData';
import { ScrollArea } from './ui/scroll-area';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useSearch } from '@/context/SearchContext';
import { useTheme } from '@/context/ThemeContext';

export function CommandMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { open, setOpen } = useSearch();
  const { sidebarData } = useSidebarData();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t('commandMenu.placeholder')} />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pr-1">
          <CommandEmpty>{t('commandMenu.noResults')}</CommandEmpty>
          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => navigate({ to: navItem.url }));
                      }}
                    >
                      <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        <ArrowRight className="text-muted-foreground/80 size-2" />
                      </div>
                      {navItem.title}
                    </CommandItem>
                  );

                return navItem.items?.map((subItem, i) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${i}`}
                    value={`${navItem.title}-${subItem.url}`}
                    onSelect={() => {
                      runCommand(() => navigate({ to: subItem.url }));
                    }}
                  >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center">
                      <ArrowRight className="text-muted-foreground/80 size-2" />
                    </div>
                    {navItem.title} <ChevronRight /> {subItem.title}
                  </CommandItem>
                ));
              })}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading={t('commandMenu.theme')}>
            <CommandItem onSelect={() => runCommand(() => setTheme('LIGHT'))}>
              <Sun /> <span>{t('commandMenu.light')}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('DARK'))}>
              <Moon className="scale-90" />
              <span>{t('commandMenu.dark')}</span>
            </CommandItem>
            {/* <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <Laptop />
              <span>{t('commandMenu.system')}</span>
            </CommandItem> */}
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
