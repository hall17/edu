import { UsersDialogs } from './components/dialogs/UsersDialogs';
import { UsersPrimaryButtons } from './components/UsersPrimaryButtons';
import { UsersTable } from './components/UsersTable';
import { UsersProvider } from './UsersContext';

export function Users() {
  return (
    <UsersProvider>
      <div className="mb-3">
        <UsersPrimaryButtons />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <UsersTable />
      </div>
      <UsersDialogs />
    </UsersProvider>
  );
}
