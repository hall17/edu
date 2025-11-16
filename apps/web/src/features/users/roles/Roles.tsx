import { RolesDialogs, RolesTable } from './components';
import { RolesProvider } from './RolesContext';

export function Roles() {
  return (
    <RolesProvider>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <RolesTable />
      </div>
      <RolesDialogs />
    </RolesProvider>
  );
}
