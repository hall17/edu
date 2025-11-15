import { UnitsActionDialog } from './UnitsActionDialog';
import { UnitsDeleteDialog } from './UnitsDeleteDialog';

import { useUnitsContext } from '@/features/subjects/subject-details/curriculums/curriculum-details/units/UnitsContext';

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
