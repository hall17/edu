import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BranchSettingsContent, BranchSettingsView } from './components';

import { Main } from '@/components/layout/Main';

export function BranchSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

  return (
    <Main>
      <div className="container mx-auto space-y-6 overflow-y-auto">
        {isEditing ? (
          <BranchSettingsContent onCancel={() => setIsEditing(false)} />
        ) : (
          <BranchSettingsView onEditClick={() => setIsEditing(true)} />
        )}
      </div>
    </Main>
  );
}
