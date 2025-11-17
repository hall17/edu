import { useUnitLessonsContext } from '../UnitLessonsContext';

import { LessonMaterialUploadDialog } from './LessonMaterialUploadDialog';
import { LessonsActionDialog } from './LessonsActionDialog';
import { LessonsDeleteDialog } from './LessonsDeleteDialog';

export function LessonsDialogs() {
  const { openedDialog } = useUnitLessonsContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
      case 'edit':
        return <LessonsActionDialog />;
      case 'delete':
        return <LessonsDeleteDialog />;
      case 'add-material':
        return <LessonMaterialUploadDialog />;
      default:
        return null;
    }
  }

  return <>{getActiveDialog()}</>;
}
