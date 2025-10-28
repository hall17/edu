import {
  CheckIcon,
  Clock,
  DotIcon,
  MoonIcon,
  PaletteIcon,
  SettingsIcon,
  SunMediumIcon,
  XIcon,
} from 'lucide-react';

import { useCalendar } from '@/components/calendar/contexts/calendar-context';
import { useDragDrop } from '@/components/calendar/contexts/dnd-context';
import type { TCalendarView } from '@/components/calendar/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

export function Settings() {
  const {
    badgeVariant,
    setBadgeVariant,
    use24HourFormat,
    toggleTimeFormat,
    view,
    setView,
    agendaModeGroupBy,
    setAgendaModeGroupBy,
  } = useCalendar();
  const { showConfirmation, setShowConfirmation } = useDragDrop();
  // const { theme, setTheme } = useTheme();

  const isDarkMode = false;
  const isDotVariant = badgeVariant === 'dot';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Calendar settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Use dark mode
            {/* <DropdownMenuShortcut>
              <Switch
                icon={
                  isDarkMode ? (
                    <MoonIcon className="h-4 w-4" />
                  ) : (
                    <SunMediumIcon className="h-4 w-4" />
                  )
                }
                checked={isDarkMode}
                onCheckedChange={(checked) =>
                  setTheme(checked ? 'dark' : 'light')
                }
              />
            </DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem>
            Show confirmation dialog on event drop
            {/* <DropdownMenuShortcut>
              <Switch
                icon={
                  showConfirmation ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <XIcon className="h-4 w-4" />
                  )
                }
                checked={showConfirmation}
                onCheckedChange={(checked) => setShowConfirmation(checked)}
              />
            </DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem>
            Use dot badge
            <DropdownMenuShortcut>
              {/* <Switch
                icon={
                  isDotVariant ? (
                    <DotIcon className="h-4 w-4" />
                  ) : (
                    <PaletteIcon className="h-4 w-4" />
                  )
                }
                checked={isDotVariant}
                onCheckedChange={(checked) =>
                  setBadgeVariant(checked ? 'dot' : 'colored')
                }
              /> */}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Use 24 hour format
            <DropdownMenuShortcut>
              {/* <Switch
                icon={
                  use24HourFormat ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )
                }
                checked={use24HourFormat}
                onCheckedChange={toggleTimeFormat}
              /> */}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Agenda view group by</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={agendaModeGroupBy}
            onValueChange={(value) =>
              setAgendaModeGroupBy(value as 'date' | 'color')
            }
          >
            <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="color">Color</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
