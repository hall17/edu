import { useSidebarData } from './data/useSidebarData';

import { BranchSwitcher } from '@/components/layout/BranchSwitcher';
import { NavGroup } from '@/components/layout/NavGroup';
// import { NavUser } from '@/components/layout/NavUser';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sidebarData } = useSidebarData();
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <BranchSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={sidebarData.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
