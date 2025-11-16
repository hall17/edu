import { BranchesProvider } from './BranchesContext';
import { BranchesTable } from './components/BranchesTable';
import { BranchesDialogs } from './components/dialogs/BranchesDialogs';

export function Branches() {
  return (
    <BranchesProvider>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <BranchesTable />
      </div>
      <BranchesDialogs />
    </BranchesProvider>
  );
}
