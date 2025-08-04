import { useState } from 'react';

import { ProfileContent } from './components/ProfileContent';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileView } from './components/ProfileView';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/stores/authStore';

export function SettingsProfile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="container mx-auto space-y-6 overflow-y-auto">
      {isEditing ? (
        <ProfileContent onCancel={() => setIsEditing(false)} />
      ) : (
        <Card>
          <ProfileHeader
            onEditClick={() => setIsEditing(true)}
            isEditing={isEditing}
          />
          <CardContent>
            <ProfileView />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
