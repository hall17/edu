import { LessonMaterialUploadDialog } from './LessonMaterialUploadDialog';
import { LessonsActionDialog } from './LessonsActionDialog';
import { LessonsDeleteDialog } from './LessonsDeleteDialog';

import { useUnitLessonsContext } from '@/features/admin/subjects/subject-details/curriculums/curriculum-details/units/unit-details/lessons/UnitLessonsContext';

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
