import { ClassroomStudentsProvider } from './ClassroomStudentsContext';
import { ClassroomStudentsDialogs } from './components/ClassroomStudentsDialogs';
import { ClassroomStudentsPrimaryButtons } from './components/ClassroomStudentsPrimaryButtons';
import { ClassroomStudentsTable } from './components/ClassroomStudentsTable';

export function ClassroomStudents() {
  return (
    <ClassroomStudentsProvider>
      <div className="mb-3 flex justify-end">
        <ClassroomStudentsPrimaryButtons />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <ClassroomStudentsTable />
      </div>
      <ClassroomStudentsDialogs />
    </ClassroomStudentsProvider>
  );
}
