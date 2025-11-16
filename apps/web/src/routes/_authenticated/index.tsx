import { createFileRoute } from '@tanstack/react-router';

import { Dashboard } from '@/features/admin/dashboard';
import {
  StudentDashboard,
  StudentDashboardProvider,
} from '@/features/student/dashboard';
import { useAuth } from '@/stores/authStore';

function DynamicDashboard() {
  const { user } = useAuth();

  // Show student dashboard for students
  if (user?.userType === 'student') {
    return (
      <StudentDashboardProvider>
        <StudentDashboard />
      </StudentDashboardProvider>
    );
  }

  // Show admin dashboard for all other users
  return <Dashboard />;
}

export const Route = createFileRoute('/_authenticated/')({
  component: DynamicDashboard,
});
