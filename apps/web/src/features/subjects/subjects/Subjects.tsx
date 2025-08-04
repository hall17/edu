import { SubjectsDialogs } from './components/SubjectsDialogs';
import { SubjectsPrimaryButtons } from './components/SubjectsPrimaryButtons';
import { SubjectsTable } from './components/SubjectsTable';
import { SubjectsProvider } from './SubjectsContext';

export function SubjectsComponent() {
  return (
    <SubjectsProvider>
      <div className="mb-3">
        <SubjectsPrimaryButtons />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <SubjectsTable />
      </div>
      <SubjectsDialogs />
    </SubjectsProvider>
  );
}
