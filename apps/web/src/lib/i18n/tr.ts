import { assessments } from './tr/assessmentsTr';
import { attendance } from './tr/attendanceTr';
import { auth } from './tr/authTr';
import { branchSettings } from './tr/branchSettingsTr';
import { calendar } from './tr/calendarTr';
import { classrooms } from './tr/classroomsTr';
import { common } from './tr/commonTr';
import { companiesAndBranches } from './tr/companiesAndBranchesTr';
import { curriculums } from './tr/curriculumsTr';
import { materials } from './tr/materialsTr';
import { modules } from './tr/modulesTr';
import { parents } from './tr/parentsTr';
import { questionBank } from './tr/questionBankTr';
import { roles } from './tr/rolesTr';
import { settings } from './tr/settingsTr';
import { students } from './tr/studentsTr';
import { subjects } from './tr/subjectsTr';
import { teachers } from './tr/teachersTr';
import { users } from './tr/usersTr';

export const tr = {
  translation: {
    ...common,
    assessments,
    attendance,
    auth,
    branchSettings,
    classrooms,
    companiesAndBranches,
    curriculums,
    materials,
    modules,
    parents,
    questionBank,
    roles,
    calendar,
    settings,
    students,
    subjects,
    teachers,
    users,
  },
};
