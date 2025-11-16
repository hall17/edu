import { assessmentRouter } from '../api/assessment/assessmentRouter';
import { attendanceRouter } from '../api/attendance/attendanceRouter';
import { authRouter } from '../api/auth/authRouter';
import { branchRouter } from '../api/branch/branchRouter';
import { classroomRouter } from '../api/classroom/classroomRouter';
import { classroomTemplateRouter } from '../api/classroomTemplate/classroomTemplateRouter';
import { companyRouter } from '../api/company/companyRouter';
import { curriculumRouter } from '../api/curriculum/curriculumRouter';
import { deviceRouter } from '../api/device/deviceRouter';
import { lessonRouter } from '../api/lesson/lessonRouter';
import { lessonMaterialRouter } from '../api/lessonMaterial/lessonMaterialRouter';
import { moduleRouter } from '../api/module/moduleRouter';
import { parentRouter } from '../api/parent/parentRouter';
import { permissionRouter } from '../api/permission/permissionRouter';
import { questionRouter } from '../api/question/questionRouter';
import { roleRouter } from '../api/role/roleRouter';
import { studentRouter } from '../api/student/studentRouter';
import { subjectRouter } from '../api/subject/subjectRouter';
import { unitRouter } from '../api/unit/unitRouter';
import { userRouter } from '../api/user/userRouter';

import { t } from '.';

export const appRouter = t.router({
  assessment: assessmentRouter,
  attendance: attendanceRouter,
  auth: authRouter,
  user: userRouter,
  student: studentRouter,
  parent: parentRouter,
  device: deviceRouter,
  role: roleRouter,
  permission: permissionRouter,
  branch: branchRouter,
  company: companyRouter,
  classroom: classroomRouter,
  classroomTemplate: classroomTemplateRouter,
  subject: subjectRouter,
  lesson: lessonRouter,
  lessonMaterial: lessonMaterialRouter,
  curriculum: curriculumRouter,
  module: moduleRouter,
  question: questionRouter,
  unit: unitRouter,
});

export type AppRouter = typeof appRouter;
