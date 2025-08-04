import { UserType } from '@edusama/common';
import { useLoaderData, useRouteContext } from '@tanstack/react-router';
import { useState } from 'react';

import { AuthLayout } from '../AuthLayout';

import { InvitationCompletionForm } from './InvitationCompletionForm';
import { InvitationForm } from './InvitationForm';

import { cn } from '@/lib/utils';

export function Invitation() {
  const [signedUpUserType, setSignedUpUserType] = useState<UserType | null>(
    null
  );

  return (
    <AuthLayout
      className={cn(
        'min-w-[100vw] md:min-w-[80vw]',
        signedUpUserType ? 'md:min-w-[50vw]' : ''
      )}
    >
      {signedUpUserType ? (
        <InvitationCompletionForm signedUpUserType={signedUpUserType} />
      ) : (
        <InvitationForm setSignedUpUserType={setSignedUpUserType} />
      )}
    </AuthLayout>
  );
}
