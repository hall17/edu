import {
  Link,
  LinkProps,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import { useState, useEffect, type JSX } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface TabNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function TabNav({ className, items, ...props }: TabNavProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // Function to check if a route pattern matches the current pathname
  const isRouteActive = (
    routePattern: string,
    currentPath: string
  ): boolean => {
    const patternParts = routePattern.split('/');
    const pathParts = currentPath.split('/');

    if (patternParts.length !== pathParts.length) {
      return false;
    }

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart?.startsWith('$')) {
        // Parameter - matches any value
        continue;
      }

      if (patternPart !== pathPart) {
        return false;
      }
    }

    return true;
  };

  // Function to find which route pattern matches the current pathname
  const getActiveRoutePattern = (): string => {
    for (const item of items) {
      if (isRouteActive(item.href as string, pathname)) {
        return item.href as string;
      }
    }
    return pathname; // fallback
  };

  const [val, setVal] = useState(getActiveRoutePattern());
  // Update selected value when pathname changes
  useEffect(() => {
    setVal(getActiveRoutePattern());
  }, [pathname]);

  const handleSelect = (routePattern: string) => {
    setVal(routePattern);
    // Navigate to current pathname (which already has the correct parameters)
    navigate({ to: pathname });
  };

  return (
    <>
      <div className="p-1 md:hidden">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-12 sm:w-48">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => {
              const isActive = isRouteActive(item.href as string, pathname);
              return (
                <SelectItem
                  key={item.href as string}
                  value={item.href as string}
                >
                  <div
                    className={cn(
                      'flex gap-x-4 px-2 py-1',
                      isActive && 'bg-muted'
                    )}
                  >
                    <span className="scale-125">{item.icon}</span>
                    <span className="text-md">{item.title}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea
        orientation="horizontal"
        type="always"
        className="bg-background hidden w-full min-w-40 px-1 py-2 md:block"
      >
        <nav className={cn('flex space-x-2 py-1', className)} {...props}>
          {items.map((item) => {
            const isActive = isRouteActive(item.href as string, pathname);
            return (
              <Link
                key={item.href as string}
                to={item.href}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  isActive
                    ? 'bg-muted hover:bg-muted'
                    : 'hover:bg-transparent hover:underline',
                  'justify-start'
                )}
              >
                <span className="mr-2">{item.icon}</span>
                {item.title}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </>
  );
}
