import { create } from 'zustand';

import countries from '@/assets/countries.json';
import { Country } from '@/components/CountrySelector';
import { RouterOutput } from '@/lib/trpc';

export type AuthUser = RouterOutput['auth']['login'] & {
  country: Country | null;
};
export type InvitedStudent = RouterOutput['auth']['verifyToken'];
// Extract the student data type from the union
export type InvitedStudentWithData = Extract<
  InvitedStudent,
  { id: string } // Use a property that only exists on Student objects
>;
export type AuthUserDevice = NonNullable<AuthUser['devices']>[number];
export interface AuthState {
  auth: {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    student: InvitedStudentWithData | null;
    setUserPreferences: (preferences: AuthUser['preferences']) => void;
    setStudent: (student: InvitedStudentWithData) => void;
    reset: () => void;
  };
}

export const useAuthStore = create<AuthState>()((set) => {
  return {
    auth: {
      user: null,
      student: null,
      setUser: (user) =>
        set((state) => ({
          ...state,
          auth: {
            ...state.auth,
            user,
          },
        })),
      setStudent: (student) =>
        set((state) => ({
          ...state,
          auth: {
            ...state.auth,
            student,
          },
        })),
      setUserPreferences: (preferences) =>
        set((state) => ({
          ...state,
          auth: {
            ...state.auth,
            user: {
              ...state.auth.user!,
              preferences: {
                ...(state.auth.user?.preferences || {}),
                ...preferences,
              },
            },
          },
        })),
      reset: () =>
        set((state) => {
          return { ...state, auth: { ...state.auth, user: null } };
        }),
    },
  };
});

export const useAuth = () => useAuthStore((state) => state.auth);
