import { useTranslation } from 'react-i18next';

import { ClassroomTemplatesProvider } from './ClassroomTemplatesContext';
import { ClassroomTemplatesDialogs } from './components/ClassroomTemplatesDialogs';
import { ClassroomTemplatesPrimaryButtons } from './components/ClassroomTemplatesPrimaryButtons';
import { ClassroomTemplatesTable } from './components/ClassroomTemplatesTable';

export function ClassroomTemplates() {
  const { t } = useTranslation();

  return (
    <ClassroomTemplatesProvider>
      <div className="mb-3">
        <ClassroomTemplatesPrimaryButtons />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <ClassroomTemplatesTable />
      </div>

      <ClassroomTemplatesDialogs />
    </ClassroomTemplatesProvider>
  );
}
