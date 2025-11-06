import { useBranchesContext } from '../../BranchesContext';

import { BranchesActionDialog } from './BranchesActionDialog';
import { BranchesDeleteDialog } from './BranchesDeleteDialog';
import { BranchesSuspendDialog } from './BranchesSuspendDialog';
import { BranchesViewDialog } from './BranchesViewDialog';

export function BranchesDialogs() {
  const { openedDialog } = useBranchesContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
        return <BranchesActionDialog />;
      case 'edit':
        return <BranchesActionDialog />;
      case 'view':
        return <BranchesViewDialog />;
      case 'suspend':
        return <BranchesSuspendDialog />;
      case 'delete':
        return <BranchesDeleteDialog />;
      default:
        return null;
    }
  }
  return <>{getActiveDialog()}</>;
}
