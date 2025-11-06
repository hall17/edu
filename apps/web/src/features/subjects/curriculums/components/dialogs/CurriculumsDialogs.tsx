import { useCurriculumsContext } from '../../CurriculumsContext';

import { CurriculumsActionDialog } from './CurriculumsActionDialog';
import { CurriculumsDeleteDialog } from './CurriculumsDeleteDialog';
import { CurriculumsViewDialog } from './CurriculumsViewDialog';

export function CurriculumsDialogs() {
  const { openedDialog } = useCurriculumsContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
        return <CurriculumsActionDialog />;
      case 'edit':
        return <CurriculumsActionDialog />;
      case 'view':
        return <CurriculumsViewDialog />;
      case 'delete':
        return <CurriculumsDeleteDialog />;
      default:
        return null;
    }
  }

  return <>{getActiveDialog()}</>;
}
