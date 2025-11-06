import { useCompaniesContext } from '../../CompaniesContext';

import { CompaniesActionDialog } from './CompaniesActionDialog';
import { CompaniesDeleteDialog } from './CompaniesDeleteDialog';
import { CompaniesSuspendDialog } from './CompaniesSuspendDialog';
import { CompaniesViewDialog } from './CompaniesViewDialog';

export function CompaniesDialogs() {
  const { openedDialog } = useCompaniesContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
        return <CompaniesActionDialog />;
      case 'edit':
        return <CompaniesActionDialog />;
      case 'view':
        return <CompaniesViewDialog />;
      case 'suspend':
        return <CompaniesSuspendDialog />;
      case 'delete':
        return <CompaniesDeleteDialog />;
      default:
        return null;
    }
  }
  return <>{getActiveDialog()}</>;
}
