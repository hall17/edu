import {
  CurriculumsDialogs,
  CurriculumsPrimaryButtons,
  CurriculumsTable,
} from './components';
import { CurriculumsProvider } from './CurriculumsContext';

export function Curriculums() {
  return (
    <CurriculumsProvider>
      <div className="mb-3">
        <CurriculumsPrimaryButtons />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <CurriculumsTable />
      </div>
      <CurriculumsDialogs />
    </CurriculumsProvider>
  );
}
