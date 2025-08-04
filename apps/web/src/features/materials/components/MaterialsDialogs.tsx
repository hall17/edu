import { useMaterialsContext } from '../MaterialsContext';

import { MaterialsAddSubjectDialog } from './MaterialsAddSubjectDialog';
import { MaterialsCurriculumActionDialog } from './MaterialsCurriculumActionDialog';
import { MaterialsCurriculumDeleteDialog } from './MaterialsCurriculumDeleteDialog';
import { MaterialsCurriculumViewDialog } from './MaterialsCurriculumViewDialog';
import { MaterialsManageSubjectsDialog } from './MaterialsManageSubjectsDialog';

export function MaterialsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useMaterialsContext();

  return (
    <>
      <MaterialsCurriculumActionDialog
        key="curriculum-add"
        open={open === 'add-curriculum'}
        onOpenChange={() => setOpen('add-curriculum')}
      />

      <MaterialsAddSubjectDialog />
      <MaterialsManageSubjectsDialog />

      {currentRow && (
        <>
          <MaterialsCurriculumActionDialog
            key={`curriculum-edit-${currentRow.id}`}
            open={open === 'edit-curriculum'}
            onOpenChange={() => {
              setOpen('edit-curriculum');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <MaterialsCurriculumViewDialog
            key={`curriculum-view-${currentRow.id}`}
            open={open === 'view-curriculum'}
            onOpenChange={() => {
              setOpen('view-curriculum');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <MaterialsCurriculumDeleteDialog
            key={`curriculum-delete-${currentRow.id}`}
            open={open === 'delete-curriculum'}
            onOpenChange={() => {
              setOpen('delete-curriculum');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
