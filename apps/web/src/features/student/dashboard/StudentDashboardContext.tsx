import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import { trpcClient } from '@/lib/trpc';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
}

interface StudentDashboardContextValue {
  student: Student | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const StudentDashboardContext = createContext<
  StudentDashboardContextValue | undefined
>(undefined);

export function StudentDashboardProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual student me endpoint when available
      // const response = await trpcClient.student.me.query();
      // setStudent(response);
      setStudent(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  return (
    <StudentDashboardContext.Provider
      value={{
        student,
        loading,
        error,
        refetch: fetchStudent,
      }}
    >
      {children}
    </StudentDashboardContext.Provider>
  );
}

export function useStudentDashboard() {
  const context = useContext(StudentDashboardContext);
  if (!context) {
    throw new Error(
      'useStudentDashboard must be used within StudentDashboardProvider'
    );
  }
  return context;
}
