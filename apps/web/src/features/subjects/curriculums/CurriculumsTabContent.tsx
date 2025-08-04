import { CurriculumsDialogs } from './components';
import { CurriculumsPrimaryButtons } from './components/CurriculumsPrimaryButtons';
import { CurriculumsTable } from './components/CurriculumsTable';
import { CurriculumsProvider } from './CurriculumsContext';

export function CurriculumsTabContent() {
  return (
    <CurriculumsProvider>
      <div className="mb-3 flex justify-end">
        <CurriculumsPrimaryButtons />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <CurriculumsTable />
      </div>
      <CurriculumsDialogs />
    </CurriculumsProvider>
  );
}
