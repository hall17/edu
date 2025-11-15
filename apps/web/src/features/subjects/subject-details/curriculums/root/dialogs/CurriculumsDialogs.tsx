import { CurriculumsActionDialog } from './CurriculumsActionDialog';
import { CurriculumsDeleteDialog } from './CurriculumsDeleteDialog';

import { useCurriculumsContext } from '@/features/subjects/subject-details/curriculums/root/CurriculumsContext';

export function CurriculumsDialogs() {
  const { openedDialog } = useCurriculumsContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
      case 'edit':
        return <CurriculumsActionDialog />;
      case 'delete':
        return <CurriculumsDeleteDialog />;
      default:
        return null;
    }
  }

  return <>{getActiveDialog()}</>;
}
