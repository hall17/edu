import type { AppRouter } from '@edusama/server';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import {
  createTRPCClient,
  httpBatchLink,
  httpLink,
  isNonJsonSerializable,
  isTRPCClientError,
  splitLink,
} from '@trpc/react-query';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { toast } from 'sonner';

import i18n from '@/lib/i18n';
import { localizedCustomErrorMessageSchema } from '@/types';

export const queryClient = new QueryClient({
  defaultOptions: {},
  queryCache: new QueryCache({
    onError: (error) => {
      console.log(error);
      if (isTRPCClientError(error)) {
        try {
          const parsedMessage = JSON.parse(error.message);

          const parsedMessageSafeParse =
            localizedCustomErrorMessageSchema.safeParse(parsedMessage);
          if (parsedMessageSafeParse.success) {
            toast.error(parsedMessageSafeParse.data.tr);
          } else {
            toast.error(i18n.t('common.anErrorOccurred'));
          }
          return;
        } catch {
          console.error(error);
        }
      }

      toast.error(i18n.t('common.anErrorOccurred'));
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (isTRPCClientError(error)) {
        try {
          const parsedMessage = JSON.parse(error.message);

          const parsedMessageSafeParse =
            localizedCustomErrorMessageSchema.safeParse(parsedMessage);

          if (parsedMessageSafeParse.success) {
            toast.error(parsedMessageSafeParse.data.tr);
          } else {
            toast.error(i18n.t('common.anErrorOccurred'));
          }
          return;
        } catch {
          console.error(error);
        }
      }

      toast.error(i18n.t('common.anErrorOccurred'));
    },
  }),
});

export const trpcClient: ReturnType<typeof createTRPCClient<AppRouter>> =
  createTRPCClient<AppRouter>({
    links: [
      splitLink({
        condition: (op) => op.input instanceof FormData,
        true: httpLink({
          url: `${import.meta.env.VITE_API_URL}/api/trpc`,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            }).catch();
          },
        }),
        false: httpBatchLink({
          url: `${import.meta.env.VITE_API_URL}/api/trpc`,
          // transformer: superjson,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            }).catch();
          },
        }),
      }),
      // httpBatchLink({
      //   url: `${import.meta.env.VITE_API_URL}/api/trpc`,
      //   // transformer: superjson,
      //   fetch(url, options) {
      //     return fetch(url, {
      //       ...options,
      //       credentials: 'include',
      //     }).catch();
      //   },
      // }),
    ],
  });

export const trpc: ReturnType<typeof createTRPCOptionsProxy<AppRouter>> =
  createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient,
  });

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type User = RouterOutput['user']['findAll']['users'][number];
export type Student = RouterOutput['student']['findAll']['students'][number];
export type FindAllStudentsInput = RouterInput['student']['findAll'];
export type Teacher = User; // Teachers are users with teacher role
export type Parent = RouterOutput['parent']['findAll']['parents'][number];
export type FindAllUsersInput = RouterInput['user']['findAll'];
export type Subject = RouterOutput['subject']['findAll']['subjects'][number];
export type FindAllSubjectsInput = RouterInput['subject']['findAll'];
export type Curriculum =
  RouterOutput['curriculum']['findAll']['curriculums'][number];
export type Lesson = RouterOutput['lesson']['findAll']['lessons'][number];
export type Classroom =
  RouterOutput['classroom']['findAll']['classrooms'][number];
export type ClassroomTemplate =
  RouterOutput['classroomTemplate']['findAll']['classroomTemplates'][number];
export type Role = RouterOutput['role']['findAll']['roles'][number];
export type ClassroomStudent =
  RouterOutput['classroom']['findAllStudents']['students'][number];
export type ClassroomStudentsFindAllInput =
  RouterInput['classroom']['findAllStudents'];
export type Module = RouterOutput['module']['findAll']['modules'][number];
export type BranchOnModule =
  RouterOutput['module']['findAll']['modules'][number]['branches'][number];
export type ClassroomIntegration =
  RouterOutput['classroom']['findAllClassroomIntegrations']['classroomIntegrations'][number];
export type ClassroomIntegrationSession =
  RouterOutput['classroom']['findOneClassroomIntegration']['classroomIntegrationSessions'][number];
export type AttendanceRecord =
  RouterOutput['classroom']['findOneClassroomIntegration']['classroomIntegrationSessions'][number]['attendanceRecords'][number];
export type Company = RouterOutput['company']['findAll']['companies'][number];
export type Branch = RouterOutput['branch']['findAll']['branches'][number];
export type BranchSingle = RouterOutput['branch']['findOne'];
export type AttendanceNotification =
  RouterOutput['auth']['findAttendanceNotifications'][number];
export type Question = RouterOutput['question']['findAll']['questions'][number];
export type QuestionRandom =
  RouterOutput['question']['findQuestionsRandom'][number];
export type Assessment =
  RouterOutput['assessment']['findAll']['assessments'][number];
// export type AssessmentQuestion =
//   RouterOutput['assessment']['findAllQuestions']['assessmentQuestions'][number];
// export type ClassroomIntegrationAssessment =
//   RouterOutput['classroom']['findAllClassroomIntegrationAssessments']['classroomIntegrationAssessments'][number];
export type ClassroomFromFindOne = RouterOutput['classroom']['findOne'];
