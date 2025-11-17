import { UnitsActionDialog } from './UnitsActionDialog';
import { UnitsDeleteDialog } from './UnitsDeleteDialog';

import { useUnitsContext } from '@/features/admin/subjects/subject-details/curriculums/curriculum-details/units/root/UnitsContext';

export function UnitsDialogs() {
  const { openedDialog } = useUnitsContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
      case 'edit':
        return <UnitsActionDialog />;
      case 'delete':
        return <UnitsDeleteDialog />;
      default:
        return null;
    }
  }

  return <>{getActiveDialog()}</>;
}
