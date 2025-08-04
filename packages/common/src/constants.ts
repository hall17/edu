export const USER_TYPES = {
  user: 'user',
  student: 'student',
  parent: 'parent',
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

export const SYSTEM_ROLES = {
  superAdmin: 'superAdmin',
  admin: 'admin',
  branchManager: 'branchManager',
  moduleManager: 'moduleManager',
  teacher: 'teacher',
  staff: 'staff',
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

export const MODULE_CODES = {
  branches: 'branches',
  modules: 'modules',
  usersAndRoles: 'users-and-roles',
  profile: 'profile',
  teachers: 'teachers',
  students: 'students',
  subjects: 'subjects',
  parents: 'parents',
  classrooms: 'classrooms',
  assessment: 'assessment',
  liveStreamSettings: 'live-stream-settings',
  attendance: 'attendance',
  materials: 'materials',
  assignments: 'assignments',
  recordedLiveClasses: 'recorded-live-classes',
  certificates: 'certificates',
  accounting: 'accounting',
  paymentGateways: 'payment-gateways',
  payments: 'payments',
  productsAndServices: 'products-and-services',
  onlineStore: 'online-store',
  videoCourses: 'video-courses',
  inventory: 'inventory',
  agreements: 'agreements',
  humanResources: 'human-resources',
  smartReports: 'smart-reports',
  announcements: 'announcements',
  helpDesk: 'help-desk',
  notifications: 'notifications',
  settings: 'settings',
  aiMentor: 'ai-mentor',
  aiChat: 'ai-chat',
  aiAutoMaterialCreation: 'ai-auto-material-creation',
} as const;

export type ModuleCode = (typeof MODULE_CODES)[keyof typeof MODULE_CODES];

export const PERMISSIONS = {
  read: 'read',
  write: 'write',
  delete: 'delete',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
