import { CompaniesProvider } from './CompaniesContext';
import { CompaniesPrimaryButtons } from './components/CompaniesPrimaryButtons';
import { CompaniesTable } from './components/CompaniesTable';
import { CompaniesDialogs } from './components/dialogs/CompaniesDialogs';

export function Companies() {
  return (
    <CompaniesProvider>
      <div className="mb-3">
        <CompaniesPrimaryButtons />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <CompaniesTable />
      </div>
      <CompaniesDialogs />
    </CompaniesProvider>
  );
}
