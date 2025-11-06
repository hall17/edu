import {
  MODULE_CODES,
  ModuleCode,
  Permission,
  SYSTEM_ROLES,
  SystemRole,
} from '@edusama/common';
import {
  AssessmentStatus,
  AssignmentStatus,
  AttendanceNotificationType,
  AttendanceStatus,
  BranchStatus,
  ClassroomIntegrationStatus,
  ClassroomStatus,
  ClassroomTemplateStatus,
  CompanyStatus,
  CurriculumStatus,
  DayOfWeek,
  DeviceCondition,
  DeviceStatus,
  DeviceType,
  EnrollmentStatus,
  Gender,
  Language,
  ModuleStatus,
  NotificationStatus,
  QuestionDifficulty,
  RoleStatus,
  ScheduleType,
  ScoringType,
  StudentStatus,
  SubjectStatus,
  Theme,
  UserStatus,
} from '@edusama/common';

import { countries } from './countriesEn';

export const common = {
  countries,
  errors: {
    maintenance: {
      title: 'Website is under maintenance!',
      description: 'The site is not available at the moment.',
      subtitle: "We'll be back online shortly.",
      learnMore: 'Learn more',
    },
    notFound: {
      title: 'Oops! Page Not Found!',
      description: "It seems like the page you're looking for",
      subtitle: 'does not exist or might have been removed.',
      goBack: 'Go Back',
      backToHome: 'Back to Home',
    },
    unauthorized: {
      title: 'Unauthorized Access',
      description: 'Please log in with the appropriate credentials',
      subtitle: 'to access this resource.',
      goBack: 'Go Back',
      backToHome: 'Back to Home',
    },
    general: {
      title: "Oops! Something went wrong :'(",
      description: 'We apologize for the inconvenience.',
      subtitle: 'Please try again later.',
      goBack: 'Go Back',
      backToHome: 'Back to Home',
    },
    forbidden: {
      title: 'Access Forbidden',
      description: "You don't have necessary permission",
      subtitle: 'to view this resource.',
      goBack: 'Go Back',
      backToHome: 'Back to Home',
    },
  },
  assignmentStatuses: {
    [AssignmentStatus.ACTIVE]: 'Active',
    [AssignmentStatus.RETURNED]: 'Returned',
    [AssignmentStatus.PENDING_RETURN]: 'Pending Return',
    [AssignmentStatus.LOST]: 'Lost',
    [AssignmentStatus.DAMAGED]: 'Damaged',
  } satisfies Record<AssignmentStatus, string>,
  attendanceNotificationStatuses: {
    [NotificationStatus.PENDING]: 'Pending',
    [NotificationStatus.SENT]: 'Sent',
    [NotificationStatus.ACKNOWLEDGED]: 'Acknowledged',
    [NotificationStatus.FAILED]: 'Failed',
  } satisfies Record<NotificationStatus, string>,
  attendanceNotificationTypes: {
    [AttendanceNotificationType.ATTENDANCE_VIOLATION]: 'Attendance Violation',
    [AttendanceNotificationType.REMINDER]: 'Reminder',
    [AttendanceNotificationType.WEEKLY_SUMMARY]: 'Weekly Summary',
    [AttendanceNotificationType.MONTHLY_SUMMARY]: 'Monthly Summary',
  } satisfies Record<AttendanceNotificationType, string>,
  attendanceStatuses: {
    [AttendanceStatus.PRESENT]: 'Present',
    [AttendanceStatus.ABSENT]: 'Absent',
    [AttendanceStatus.PARTIAL]: 'Partial',
    [AttendanceStatus.LATE]: 'Late',
    [AttendanceStatus.EXCUSED]: 'Excused',
  } satisfies Record<AttendanceStatus, string>,
  branchStatuses: {
    [BranchStatus.ACTIVE]: 'Active',
    [BranchStatus.SUSPENDED]: 'Suspended',
  } satisfies Record<BranchStatus, string>,
  classroomStatuses: {
    [ClassroomStatus.ACTIVE]: 'Active',
    [ClassroomStatus.SUSPENDED]: 'Suspended',
    [ClassroomStatus.TERMINATED]: 'Terminated',
  } satisfies Record<ClassroomStatus, string>,
  classroomTemplateStatuses: {
    [ClassroomTemplateStatus.ACTIVE]: 'Active',
    [ClassroomTemplateStatus.SUSPENDED]: 'Suspended',
    [ClassroomTemplateStatus.TERMINATED]: 'Terminated',
  } satisfies Record<ClassroomTemplateStatus, string>,
  classroomIntegrationStatuses: {
    [ClassroomIntegrationStatus.ACTIVE]: 'Active',
    [ClassroomIntegrationStatus.COMPLETED]: 'Completed',
    [ClassroomIntegrationStatus.SUSPENDED]: 'Suspended',
  } satisfies Record<ClassroomIntegrationStatus, string>,
  companyStatuses: {
    [CompanyStatus.ACTIVE]: 'Active',
    [CompanyStatus.SUSPENDED]: 'Suspended',
  } satisfies Record<CompanyStatus, string>,
  curriculumStatuses: {
    [CurriculumStatus.ACTIVE]: 'Active',
    [CurriculumStatus.SUSPENDED]: 'Suspended',
    [CurriculumStatus.TERMINATED]: 'Terminated',
  } satisfies Record<CurriculumStatus, string>,
  days: {
    [DayOfWeek.MONDAY]: 'Monday',
    [DayOfWeek.TUESDAY]: 'Tuesday',
    [DayOfWeek.WEDNESDAY]: 'Wednesday',
    [DayOfWeek.THURSDAY]: 'Thursday',
    [DayOfWeek.FRIDAY]: 'Friday',
    [DayOfWeek.SATURDAY]: 'Saturday',
    [DayOfWeek.SUNDAY]: 'Sunday',
  } satisfies Record<DayOfWeek, string>,
  deviceConditions: {
    [DeviceCondition.NEW]: 'New',
    [DeviceCondition.EXCELLENT]: 'Excellent',
    [DeviceCondition.GOOD]: 'Good',
    [DeviceCondition.FAIR]: 'Fair',
    [DeviceCondition.POOR]: 'Poor',
    [DeviceCondition.DAMAGED]: 'Damaged',
  } satisfies Record<DeviceCondition, string>,
  deviceStatuses: {
    [DeviceStatus.AVAILABLE]: 'Available',
    [DeviceStatus.ASSIGNED]: 'Assigned',
    [DeviceStatus.IN_REPAIR]: 'In repair',
    [DeviceStatus.RETIRED]: 'Retired',
    [DeviceStatus.LOST]: 'Lost',
    [DeviceStatus.STOLEN]: 'Stolen',
  } satisfies Record<DeviceStatus, string>,
  deviceTypes: {
    [DeviceType.LAPTOP]: 'Laptop',
    [DeviceType.DESKTOP]: 'Desktop',
    [DeviceType.TABLET]: 'Tablet',
    [DeviceType.SMARTPHONE]: 'Smartphone',
    [DeviceType.MONITOR]: 'Monitor',
    [DeviceType.KEYBOARD]: 'Keyboard',
    [DeviceType.MOUSE]: 'Mouse',
    [DeviceType.HEADSET]: 'Headset',
    [DeviceType.WEBCAM]: 'Webcam',
    [DeviceType.PRINTER]: 'Printer',
    [DeviceType.OTHER]: 'Other',
  } satisfies Record<DeviceType, string>,
  enrollmentStatuses: {
    [EnrollmentStatus.ENROLLED]: 'Enrolled',
    [EnrollmentStatus.WITHDRAWN]: 'Withdrawn',
    [EnrollmentStatus.COMPLETED]: 'Completed',
  } satisfies Record<EnrollmentStatus, string>,
  genders: {
    [Gender.MALE]: 'Male',
    [Gender.FEMALE]: 'Female',
    [Gender.OTHER]: 'Other',
  } satisfies Record<Gender, string>,
  languages: {
    [Language.EN]: 'English',
    [Language.TR]: 'Turkish',
    [Language.DE]: 'German',
    [Language.ES]: 'Spanish',
    [Language.FR]: 'French',
    [Language.IT]: 'Italian',
    [Language.PT]: 'Portuguese',
    [Language.RU]: 'Russian',
    [Language.ZH]: 'Chinese',
    [Language.JA]: 'Japanese',
  } satisfies Record<Language, string>,
  moduleStatuses: {
    [ModuleStatus.ACTIVE]: 'Active',
    [ModuleStatus.INACTIVE]: 'Inactive',
    [ModuleStatus.DELETED]: 'Deleted',
  } satisfies Record<ModuleStatus, string>,
  roleStatuses: {
    [RoleStatus.ACTIVE]: 'Active',
    [RoleStatus.SUSPENDED]: 'Suspended',
  } satisfies Record<RoleStatus, string>,
  studentStatuses: {
    [StudentStatus.ACTIVE]: 'Active',
    [StudentStatus.SUSPENDED]: 'Suspended',
    [StudentStatus.INVITED]: 'Invited',
    [StudentStatus.REQUESTED_APPROVAL]: 'Requested Approval',
    [StudentStatus.REQUESTED_CHANGES]: 'Requested Changes',
    [StudentStatus.REJECTED]: 'Rejected',
  } satisfies Record<StudentStatus, string>,
  assessmentStatuses: {
    [AssessmentStatus.ACTIVE]: 'Active',
    [AssessmentStatus.SUSPENDED]: 'Suspended',
    [AssessmentStatus.TERMINATED]: 'Terminated',
  } satisfies Record<AssessmentStatus, string>,
  assessmentScheduleTypes: {
    [ScheduleType.FLEXIBLE]: 'Flexible',
    [ScheduleType.STRICT]: 'Strict',
  } satisfies Record<ScheduleType, string>,
  assessmentScoringTypes: {
    [ScoringType.MANUAL]: 'Manual',
    [ScoringType.AUTOMATIC]: 'Automatic',
  } satisfies Record<ScoringType, string>,
  subjectStatuses: {
    [SubjectStatus.ACTIVE]: 'Active',
    [SubjectStatus.SUSPENDED]: 'Suspended',
    [SubjectStatus.TERMINATED]: 'Terminated',
  } satisfies Record<SubjectStatus, string>,
  themes: {
    [Theme.LIGHT]: 'Light',
    [Theme.DARK]: 'Dark',
  } satisfies Record<Theme, string>,
  userStatuses: {
    [UserStatus.ACTIVE]: 'Active',
    [UserStatus.SUSPENDED]: 'Suspended',
    [UserStatus.INVITED]: 'Invited',
  } satisfies Record<UserStatus, string>,
  questionTypes: {
    MULTIPLE_CHOICE: 'Multiple Choice',
    TRUE_FALSE: 'True/False',
    SHORT_ANSWER: 'Short Answer',
    ESSAY: 'Essay',
    FILL_IN_BLANK: 'Fill in the Blank',
    MATCHING: 'Matching',
    ORDERING: 'Ordering',
  },
  trueFalseOptions: {
    true: 'True',
    false: 'False',
  },
  questionDifficulties: {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard',
  } satisfies Record<QuestionDifficulty, string>,
  moduleDescriptions: {
    [MODULE_CODES.subjects]: 'Manage subjects and their teachers',
    [MODULE_CODES.accounting]:
      'Manage financial records, invoices, and payment tracking for the institution',
    [MODULE_CODES.assessment]:
      'Create and manage quizzes, tests, and assessments with detailed analytics',
    [MODULE_CODES.assignments]:
      'Assign tasks, projects, and homework with automatic grading and feedback',
    [MODULE_CODES.recordedLiveClasses]:
      'Record live sessions and provide on-demand access to educational content',
    [MODULE_CODES.attendance]:
      'Track student attendance with automated reporting and notifications',
    [MODULE_CODES.materials]:
      'Upload, organize, and distribute course materials and resources',
    [MODULE_CODES.branches]:
      'Manage multiple branch locations and their configurations',
    [MODULE_CODES.modules]:
      'Control and configure system modules and their availability',
    [MODULE_CODES.usersAndRoles]:
      'Manage user accounts, permissions, and role-based access control',
    [MODULE_CODES.profile]: 'Manage user profiles and personal information',
    [MODULE_CODES.teachers]:
      'Manage teacher accounts, schedules, and performance tracking',
    [MODULE_CODES.students]:
      'Manage student enrollments, progress, and academic records',
    [MODULE_CODES.parents]:
      'Manage parent accounts and communication with guardians',
    [MODULE_CODES.classrooms]:
      'Create and manage classroom templates and configurations',
    [MODULE_CODES.liveStreamSettings]:
      'Configure live streaming settings and broadcasting options',
    [MODULE_CODES.certificates]:
      'Issue and manage digital certificates for course completion and achievements',
    [MODULE_CODES.paymentGateways]:
      'Configure payment processors and transaction handling',
    [MODULE_CODES.payments]:
      'Process payments, manage subscriptions, and handle billing',
    [MODULE_CODES.productsAndServices]:
      'Manage educational products and service offerings',
    [MODULE_CODES.onlineStore]:
      'Run an online marketplace for educational products',
    [MODULE_CODES.videoCourses]:
      'Create and manage video-based learning content',
    [MODULE_CODES.inventory]:
      'Track and manage educational resources and equipment',
    [MODULE_CODES.agreements]:
      'Manage contracts, terms of service, and legal documents',
    [MODULE_CODES.humanResources]:
      'Handle employee management, payroll, and HR operations',
    [MODULE_CODES.smartReports]:
      'Generate intelligent reports and analytics for insights',
    [MODULE_CODES.announcements]:
      'Create and distribute system-wide announcements',
    [MODULE_CODES.helpDesk]:
      'Provide customer support and technical assistance',
    [MODULE_CODES.notifications]:
      'Manage notification preferences and system alerts',
    [MODULE_CODES.settings]: 'Configure system settings and preferences',
    [MODULE_CODES.aiMentor]:
      'AI-powered mentoring and personalized learning assistance',
    [MODULE_CODES.aiChat]:
      'Intelligent chatbot for student support and queries',
    [MODULE_CODES.aiAutoMaterialCreation]:
      'Automatically generate educational content using AI',
  } satisfies Record<ModuleCode, string>,
  moduleNames: {
    [MODULE_CODES.subjects]: 'Subjects',
    [MODULE_CODES.accounting]: 'Accounting',
    [MODULE_CODES.assessment]: 'Assessment',
    [MODULE_CODES.assignments]: 'Assignments',
    [MODULE_CODES.recordedLiveClasses]: 'Recorded Live Classes',
    [MODULE_CODES.attendance]: 'Attendance',
    [MODULE_CODES.materials]: 'Materials',
    [MODULE_CODES.branches]: 'Branches',
    [MODULE_CODES.modules]: 'Modules',
    [MODULE_CODES.usersAndRoles]: 'Users and Roles',
    [MODULE_CODES.profile]: 'Profile',
    [MODULE_CODES.teachers]: 'Teachers',
    [MODULE_CODES.students]: 'Students',
    [MODULE_CODES.parents]: 'Parents',
    [MODULE_CODES.classrooms]: 'Classrooms',
    [MODULE_CODES.liveStreamSettings]: 'Live Stream Settings',
    [MODULE_CODES.certificates]: 'Certificates',
    [MODULE_CODES.paymentGateways]: 'Payment Gateways',
    [MODULE_CODES.payments]: 'Payments',
    [MODULE_CODES.productsAndServices]: 'Products and Services',
    [MODULE_CODES.onlineStore]: 'Online Store',
    [MODULE_CODES.videoCourses]: 'Video Courses',
    [MODULE_CODES.inventory]: 'Inventory',
    [MODULE_CODES.agreements]: 'Agreements',
    [MODULE_CODES.humanResources]: 'Human Resources',
    [MODULE_CODES.smartReports]: 'Smart Reports',
    [MODULE_CODES.announcements]: 'Announcements',
    [MODULE_CODES.helpDesk]: 'Help Desk',
    [MODULE_CODES.notifications]: 'Notifications',
    [MODULE_CODES.settings]: 'Settings',
    [MODULE_CODES.aiMentor]: 'AI Mentor',
    [MODULE_CODES.aiChat]: 'AI Chat',
    [MODULE_CODES.aiAutoMaterialCreation]: 'AI Auto Material Creation',
  } satisfies Record<ModuleCode, string>,
  permissionNames: {
    read: 'Read',
    write: 'Write',
    delete: 'Delete',
  } satisfies Record<Permission, string>,
  systemRoles: {
    [SYSTEM_ROLES.superAdmin]: 'Super Admin',
    [SYSTEM_ROLES.admin]: 'Admin',
    [SYSTEM_ROLES.branchManager]: 'Branch Manager',
    [SYSTEM_ROLES.moduleManager]: 'Module Manager',
    [SYSTEM_ROLES.teacher]: 'Teacher',
    [SYSTEM_ROLES.staff]: 'Staff',
  } satisfies Record<SystemRole, string>,
  combobox: {
    selectOption: 'Select option...',
    search: 'Search...',
    noOptionFound: 'No option found.',
    selectParent: 'Select parent...',
    searchParents: 'Search parents...',
    noParentsFound: 'No parents found',
  },
  common: {
    myChildren: 'My children',
    search: 'Search...',
    title: 'Title',
    updating: 'Updating...',
    // common validation messages
    details: 'Details',
    unknownError: 'An unknown error',
    requiredField: 'Required field',
    numberValueMinError: 'Value must be at least {{count}}',
    numberValueMaxError: 'Value must be at most {{count}}',
    stringValueMinLengthError: 'Value must be at least {{count}} characters',
    stringValueMaxLengthError: 'Value must be at most {{count}} characters',
    invalidEmail: 'Invalid email format',
    invalidUrl: 'Invalid URL format',
    endDateMustBeAfterStartDate: 'End date must be after start date',
    sessionMustBeOnSameDay: 'Session must be on the same day',
    allStudentsMustHaveAttendanceRecord:
      'All students must have attendance records',
    passwordsDoNotMatch: 'Passwords do not match',
    phoneNumberInvalid: 'Invalid phone number',
    nationalIdInvalid: 'Invalid national ID',
    actions: 'Actions',
    remove: 'Remove',
    resetFilters: 'Reset Filters',
    reset: 'Reset',
    next: 'Next',
    pagination: {
      showing: 'Showing',
      of: 'of',
      results: 'results',
    },
    saveChanges: 'Save Changes',
    saveAndContinue: 'Save & Continue',
    createAndContinue: 'Create & Continue',
    previous: 'Previous',
    finish: 'Finish',
    save: 'Save',
    active: 'Active',
    and: 'and',
    anErrorOccurred: 'An error occurred. Please try again later.',
    yes: 'Yes',
    no: 'No',
    cancel: 'Cancel',
    continue: 'Continue',
    curriculums: 'Curriculums',
    close: 'Close',
    email: 'Email',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    lastUpdatedAt: 'Last Updated At',
    statusUpdatedAt: 'Suspended At',
    statusUpdateReason: 'Suspended Reason',
    deletedAt: 'Deleted At',
    or: 'or',
    password: 'Password',
    pleaseEnterYourEmail: 'Please enter your email',
    selectDate: 'Select date',
    // Common form fields
    firstName: 'First Name',
    lastName: 'Last Name',
    username: 'Username',
    phoneNumber: 'Phone Number',
    nationalId: 'National ID',
    dateOfBirth: 'Date of Birth',
    questions: 'questions',
    ratio: 'ratio',
    gender: 'Gender',
    country: 'Country',
    city: 'City',
    inactive: 'Inactive',
    state: 'State',
    address: 'Address',
    zipCode: 'Zip Code',
    profilePictureUrl: 'Profile Picture',
    fullName: 'Full Name',
    status: 'Status',
    type: 'Type',
    parent: 'Parent',
    role: 'Role',
    entity: 'Entity',
    reason: 'Reason',
    note: 'Note',
    description: 'Description',
    subject: 'Subject',
    selectSubject: 'Select a subject',
    searchSubjects: 'Search subjects...',
    noSubjectsFound: 'No subjects found',
    subjectRequired: 'Subject is required',
    taughtSubjects: 'Taught Subjects',
    selectTaughtSubjects: 'Select taught subjects',
    searchTaughtSubjects: 'Search taught subjects...',
    name: 'Name',
    curriculum: 'Curriculum',
    lessons: 'Lessons',
    // Social media
    facebook: 'Facebook',
    twitter: 'X (Twitter)',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    selectStatus: 'Select status',
    // Common placeholders
    selectGender: 'Select gender',
    selectDateOfBirth: 'Select date of birth',
    // Common validation messages
    required: 'is required',

    invalidValue: 'Invalid value',
    tooLong: 'too long',
    noDateSelected: 'No date selected',
    enrolledAt: 'Enrolled At',
    // Form validation messages
    profilePictureFileSizeError: 'File size must be less than 2MB',
    profilePictureFileTypeError: 'Only JPEG, PNG, and WebP images are allowed',
    confirmPasswordRequired: 'Please confirm your password',
    statusUpdateReasonRequired: 'Suspended reason is required',
    //
    returnToHomepage: 'Return to homepage',
    clickHereToLogin: 'Click here to login',
    // Confirmation dialog
    confirmClose: 'Confirm Close',
    unsavedChangesWarning:
      'You have unsaved changes. Are you sure you want to close without saving?',
    discardChanges: 'Discard Changes',
    create: 'Create',
    update: 'Update',
    optional: 'Optional',
    changeImage: 'Change Image',
    uploadImage: 'Upload Image',
    imageUploadHelp: 'Click or drag image • PNG, JPG, WEBP up to 2MB',
    imagePreview: 'Image Preview',
    imagePreviewDescription: 'Click to view image in full size',
    capacity: 'Capacity',
    startDate: 'Start Date',
    endDate: 'End Date',
    accessLink: 'Access Link',
    view: 'View',
    edit: 'Edit',
    suspend: 'Suspend',
    activate: 'Activate',
    changePassword: 'Change Password',
    delete: 'Delete',
    loading: 'Loading...',
    loadingContent: 'Please wait while we load your content...',
    back: 'Back',
    noRecord: 'No record',
    pleaseEnsureAllFieldsAreValid: 'Please ensure all fields are valid',
    pleaseFillInAllRequiredFields: 'Please fill in all required fields',
    select: 'Select',
  },
  // Shared dialog translations
  dialogs: {
    invite: {
      titleStudent: 'Invite Student',
      descriptionStudent:
        'Invite new student to join your school by sending them an email invitation.',
      titleTeacher: 'Invite Teacher',
      descriptionTeacher:
        'Invite new teacher to join your institution by sending them an email invitation.',
      titleParent: 'Invite Parent',
      descriptionParent:
        'Invite new parent to join your school by sending them an email invitation.',
      titleUser: 'Invite User',
      descriptionUser:
        'Invite new user to join your system by sending them an email invitation.',
      form: {
        email: 'Email',
        type: 'Type',
        description: 'Description (optional)',
        selectType: 'Select a type',
        cancel: 'Cancel',
        invite: 'Invite',
      },
      placeholders: {
        email: 'eg: john.doe@gmail.com',
        description: 'Add a personal note to your invitation (optional)',
      },
      successStudent: 'Student invited successfully',
      successTeacher: 'Teacher invited successfully',
      successParent: 'Parent invited successfully',
      successUser: 'User invited successfully',
    },
    delete: {
      titleStudent: 'Delete Student',
      confirmMessageStudent:
        'Student will be permanently removed from the system. Are you sure you want to proceed?',
      permanentRemovalWarningStudent:
        'This action will permanently remove the student from the system. This cannot be undone.',
      titleTeacher: 'Delete Teacher',
      confirmMessageTeacher:
        'Teacher will be permanently removed from the system. Are you sure you want to proceed?',
      permanentRemovalWarningTeacher:
        'This action will permanently remove the teacher from the system. This cannot be undone.',
      titleParent: 'Delete Parent',
      confirmMessageParent:
        'Parent will be permanently removed from the system. Are you sure you want to proceed?',
      permanentRemovalWarningParent:
        'This action will permanently remove the parent from the system. This cannot be undone.',
      titleUser: 'Delete User',
      confirmMessageUser:
        'User will be permanently removed from the system. Are you sure you want to proceed?',
      permanentRemovalWarningUser:
        'This action will permanently remove the user from the system. This cannot be undone.',
      warningTitle: 'Warning!',
      warningDescription:
        'Please be careful, this operation cannot be rolled back.',
      confirmButtonText: 'Delete',
      successMessageStudent: 'Student deleted successfully',
      successMessageTeacher: 'Teacher deleted successfully',
      successMessageParent: 'Parent deleted successfully',
      successMessageUser: 'User deleted successfully',
      successMessageClassroomSession: 'Session deleted successfully',
      errorMessageClassroomSession:
        'Failed to delete session. Please try again.',
    },
    suspend: {
      titleStudent: 'Suspend Student',
      suspendTitleStudent: 'Suspend Student',
      activateTitleStudent: 'Activate Student',
      descriptionStudent:
        'Suspend this student account to temporarily restrict access.',
      suspendDescriptionStudent:
        'Suspend this student account to temporarily restrict access.',
      activateDescriptionStudent:
        'Activate this student account to restore access to the system.',
      confirmMessageStudent:
        'Student will be suspended and will not be able to access the system. Are you sure you want to proceed?',
      suspendedMessageStudent:
        'Student will be reactivated and will regain access to the system. Are you sure you want to proceed?',
      titleTeacher: 'Suspend Teacher',
      suspendTitleTeacher: 'Suspend Teacher',
      activateTitleTeacher: 'Activate Teacher',
      descriptionTeacher:
        'Suspend this teacher account to temporarily restrict access.',
      suspendDescriptionTeacher:
        'Suspend this teacher account to temporarily restrict access.',
      activateDescriptionTeacher:
        'Activate this teacher account to restore access to the system.',
      confirmMessageTeacher:
        'Teacher will be suspended and will not be able to access the system. Are you sure you want to proceed?',
      suspendedMessageTeacher:
        'Teacher will be reactivated and will regain access to the system. Are you sure you want to proceed?',
      titleParent: 'Suspend Parent',
      suspendTitleParent: 'Suspend Parent',
      activateTitleParent: 'Activate Parent',
      descriptionParent:
        'Suspend this parent account to temporarily restrict access.',
      suspendDescriptionParent:
        'Suspend this parent account to temporarily restrict access.',
      activateDescriptionParent:
        'Activate this parent account to restore access to the system.',
      confirmMessageParent:
        'Parent will be suspended and will not be able to access the system. Are you sure you want to proceed?',
      suspendedMessageParent:
        'Parent will be reactivated and will regain access to the system. Are you sure you want to proceed?',
      titleUser: 'Suspend User',
      suspendTitleUser: 'Suspend User',
      activateTitleUser: 'Activate User',
      descriptionUser:
        'Suspend this user account to temporarily restrict access.',
      suspendDescriptionUser:
        'Suspend this user account to temporarily restrict access.',
      activateDescriptionUser:
        'Activate this user account to restore access to the system.',
      confirmMessageUser:
        'User will be suspended and will not be able to access the system. Are you sure you want to proceed?',
      suspendedMessageUser:
        'User will be reactivated and will regain access to the system. Are you sure you want to proceed?',
      warningTitle: 'Warning!',
      warningDescriptionStudent:
        "This action will change the student's account status. You can revert this action later.",
      warningDescriptionTeacher:
        "This action will change the teacher's account status. You can revert this action later.",
      warningDescriptionParent:
        "This action will change the parent's account status. You can revert this action later.",
      warningDescriptionUser:
        "This action will change the user's account status. You can revert this action later.",
      statusUpdateReasonLabel: 'Reason for suspension',
      statusUpdateReasonPlaceholderStudent:
        'Please provide a reason for suspending this student...',
      statusUpdateReasonPlaceholderTeacher:
        'Please provide a reason for suspending this teacher...',
      statusUpdateReasonPlaceholderParent:
        'Please provide a reason for suspending this parent...',
      statusUpdateReasonPlaceholderUser:
        'Please provide a reason for suspending this user...',
      statusUpdateReasonRequired: 'Suspended reason is required',
      confirmButtonText: 'Suspend',
      suspendButtonText: 'Suspend',
      activateButtonText: 'Activate',
      reactivateButtonText: 'Reactivate',
      cancel: 'Cancel',
      successMessageStudent: 'Student status updated successfully',
      successMessageTeacher: 'Teacher status updated successfully',
      successMessageParent: 'Parent status updated successfully',
      successMessageUser: 'User status updated successfully',
      errorMessageStudent: 'Failed to update student status. Please try again.',
      errorMessageTeacher: 'Failed to update teacher status. Please try again.',
      errorMessageParent: 'Failed to update parent status. Please try again.',
      errorMessageUser: 'Failed to update user status. Please try again.',
      successMessageAssessment: 'Assessment status updated successfully',
      errorMessageAssessment:
        'Failed to update assessment status. Please try again.',
      titleAssessment: 'Suspend Assessment',
      suspendTitleAssessment: 'Suspend Assessment',
      activateTitleAssessment: 'Activate Assessment',
      descriptionAssessment:
        'Suspend this assessment to temporarily restrict access.',
      suspendDescriptionAssessment:
        'Suspend this assessment to temporarily restrict access.',
      activateDescriptionAssessment:
        'Activate this assessment to restore access to the system.',
      confirmMessageAssessment:
        'Assessment will be suspended and will not be able to be used. Are you sure you want to proceed?',
      suspendedMessageAssessment:
        'Assessment will be reactivated and will be available for use. Are you sure you want to proceed?',
      warningDescriptionAssessment:
        "This action will change the assessment's status. You can revert this action later.",
      statusUpdateReasonPlaceholderAssessment:
        'Please provide a reason for suspending this assessment...',
    },
    changePassword: {
      titleStudent: 'Reset Student Password',
      descriptionStudent: 'Send a password reset email to this student.',
      confirmMessageStudent:
        'A password reset email will be sent to {{email}}. The student will receive instructions to create a new password.',
      titleTeacher: 'Reset Teacher Password',
      descriptionTeacher: 'Send a password reset email to this teacher.',
      confirmMessageTeacher:
        'A password reset email will be sent to {{email}}. The teacher will receive instructions to create a new password.',
      titleParent: 'Reset Parent Password',
      descriptionParent: 'Send a password reset email to this parent.',
      confirmMessageParent:
        'A password reset email will be sent to {{email}}. The parent will receive instructions to create a new password.',
      titleUser: 'Reset User Password',
      descriptionUser: 'Send a password reset email to this user.',
      confirmMessageUser:
        'A password reset email will be sent to {{email}}. The user will receive instructions to create a new password.',
      warningTitle: 'Information',
      warningDescriptionStudent:
        'The student will receive an email with a secure link to reset their password. The link will expire after 7 days.',
      warningDescriptionTeacher:
        'The teacher will receive an email with a secure link to reset their password. The link will expire after 7 days.',
      warningDescriptionParent:
        'The parent will receive an email with a secure link to reset their password. The link will expire after 7 days.',
      warningDescriptionUser:
        'The user will receive an email with a secure link to reset their password. The link will expire after 7 days.',
      confirmButtonText: 'Send Reset Email',
      cancel: 'Cancel',
      successMessage: 'Password reset email sent successfully',
      errorMessage: 'Failed to send password reset email',
    },
    resendInvitation: {
      title: 'Resend Invitation',
      description: 'Resend the invitation email to this student.',
      warningTitle: 'Information',
      warningDescription:
        'The student will receive an email with a secure link to complete their signup. The link will expire after 7 days.',
      confirmMessage:
        'An invitation email will be sent to {{email}}. The student will receive instructions to complete their account setup.',
      confirmButtonText: 'Resend Invitation',
      cancel: 'Cancel',
      successMessage: 'Invitation email sent successfully',
      errorMessage: 'Failed to send invitation email',
    },
    action: {
      success: {
        createStudent: 'Student created successfully.',
        updateStudent: 'Student updated successfully.',
        importStudent: 'Students imported successfully.',
        createTeacher: 'Teacher created successfully.',
        updateTeacher: 'Teacher updated successfully.',
        importTeacher: 'Teachers imported successfully.',
        createParent: 'Parent created successfully.',
        updateParent: 'Parent updated successfully.',
        importParent: 'Parents imported successfully.',
        createUser: 'User created successfully.',
        updateUser: 'User updated successfully.',
        importUser: 'Users imported successfully.',
      },
      error: {
        createStudent: 'Failed to create student.',
        updateStudent: 'Failed to update student.',
        importStudent: 'Failed to import students.',
        createTeacher: 'Failed to create teacher.',
        updateTeacher: 'Failed to update teacher.',
        importTeacher: 'Failed to import teachers.',
        createParent: 'Failed to create parent.',
        updateParent: 'Failed to update parent.',
        importParent: 'Failed to import parents.',
        createUser: 'Failed to create user.',
        updateUser: 'Failed to update user.',
        importUser: 'Failed to import users.',
      },
      addTitleStudent: 'Add New Student',
      editTitleStudent: 'Edit Student',
      addDescriptionStudent:
        "Create new student here. Click save when you're done.",
      editDescriptionStudent:
        "Update the student here. Click save when you're done.",
      addTitleTeacher: 'Add New Teacher',
      editTitleTeacher: 'Edit Teacher',
      addDescriptionTeacher:
        "Create new teacher here. Click save when you're done.",
      editDescriptionTeacher:
        "Update the teacher here. Click save when you're done.",
      addTitleParent: 'Add New Parent',
      editTitleParent: 'Edit Parent',
      addDescriptionParent:
        "Create new parent here. Click save when you're done.",
      editDescriptionParent:
        "Update the parent here. Click save when you're done.",
      addTitleUser: 'Add New User',
      editTitleUser: 'Edit User',
      addDescriptionUser: "Create new user here. Click save when you're done.",
      editDescriptionUser: "Update the user here. Click save when you're done.",
      form: {
        saveChanges: 'Save changes',
        create: 'Create',
        update: 'Update',
      },
      placeholders: {
        firstName: 'John',
        lastName: 'Doe',
        username: 'john_doe',
        email: 'john.doe@gmail.com',
        phoneNumber: '+123456789',
        nationalId: 'National ID',
        country: 'Country',
        city: 'City',
        state: 'State',
        address: 'Address',
        zipCode: 'Zip Code',
        facebookLink: 'https://facebook.com/username',
        twitterLink: 'https://x.com/username',
        instagramLink: 'https://instagram.com/username',
        linkedinLink: 'https://linkedin.com/in/username',
      },
    },
    view: {
      title: '{{entity}} Details',
      description: 'View detailed information about this {{entity}}.',
      sections: {
        basicInformation: 'Basic Information',
        personalInformation: 'Personal Information',
        contactInformation: 'Contact Information',
        socialLinks: 'Social Links',
        accountInformation: 'Account Information',
        statistics: 'Statistics',
        systemInformation: 'System Information',
      },
      fields: {
        about: 'About',
        fullName: 'Full Name',
        email: 'Email',
        phoneNumber: 'Phone Number',
        nationalId: 'National ID',
        gender: 'Gender',
        dateOfBirth: 'Date of Birth',
        country: 'Country',
        city: 'City',
        state: 'State',
        address: 'Address',
        zipCode: 'Zip Code',
        profilePicture: 'Profile Picture',
        facebookLink: 'Facebook',
        twitterLink: 'X (Twitter)',
        instagramLink: 'Instagram',
        linkedinLink: 'LinkedIn',
        status: 'Status',
        createdAt: 'Created At',
        lastUpdatedAt: 'Last Updated At',
        updatedAt: 'Last Updated',
        statusUpdatedAt: 'Status Updated At',
        statusUpdateReason: 'Status Update Reason',
      },
      close: 'Close',
    },
  },
  commandMenu: {
    placeholder: 'Type a command or search...',
    noResults: 'No results found.',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  dataTable: {
    noResults: 'No results.',
    selectAll: 'Select all',
    selectRow: 'Select row',
  },
  table: {
    sort: {
      asc: 'Asc',
      desc: 'Desc',
    },
    actions: {
      hide: 'Hide',
      view: 'View',
      clearFilters: 'Clear filters',
      resetSort: 'Reset sort',
    },
    filters: {
      noResults: 'No results found.',
      selectedCount: '{{count}} selected',
    },
    pagination: {
      rowsPerPage: 'Rows per page',
      pageXofY: 'Page {{page}} of {{total}}',
      goToFirstPage: 'Go to first page',
      goToPreviousPage: 'Go to previous page',
      goToNextPage: 'Go to next page',
      goToLastPage: 'Go to last page',
      selectedOfTotal: '{{selected}} of {{total}} row(s) selected.',
    },
    view: {
      toggleColumns: 'Toggle columns',
    },
  },

  sidebar: {
    teams: {
      shadcnAdmin: 'Shadcn Admin',
      acmeInc: 'Acme Inc',
      acmeCorp: 'Acme Corp.',
    },
    navGroups: {
      academySection: 'Academy Section',
      managementSection: 'Management Section',
      superManagementSection: 'Super Management Section',
      supportSection: 'Support Section',
      general: 'General',
      pages: 'Pages',
      other: 'Other',
    },
    navigation: {
      // academy section

      dashboard: 'Dashboard',
      tasks: 'Tasks',
      apps: 'Apps',
      chats: 'Chats',
      users: 'Users',
      students: 'Students',
      teachers: 'Teachers',
      parents: 'Parents',
      classrooms: 'Classrooms',
      attendance: 'Attendance',
      subjectsCurriculums: 'Subjects & Curriculums',
      questionBank: 'Question Bank',
      assessments: 'Assessments',
      materials: 'Materials',
      securedByClerk: 'Secured by Clerk',
      auth: 'Auth',
      login: 'Login',
      loginTwoCol: 'Login (2 Col)',
      signUp: 'Sign Up',
      forgotPassword: 'Forgot Password',
      otp: 'OTP',
      errors: 'Errors',
      unauthorized: 'Unauthorized',
      forbidden: 'Forbidden',
      notFound: 'Not Found',
      internalServerError: 'Internal Server Error',
      maintenanceError: 'Maintenance Error',
      // management section
      usersAndRoles: 'Users and Roles',
      modules: 'Modules',
      branchSettings: 'Branch Settings',
      // super management section
      companiesAndBranches: 'Companies & Branches',
      companies: 'Companies',
      branches: 'Branches',
      settings: 'Settings',
      profile: 'Profile',
      inventory: 'Inventory',
      security: 'Security',
      preferences: 'Preferences',
      helpCenter: 'Help Center',
    },
  },
  fileDroppableArea: {
    dragAndDropText: 'Drag and drop to upload file or',
    browseFromDisk: 'Browse from disk',
    selectedFile: 'Selected file',
  },
  countrySelector: {
    selectCountry: 'Select a country',
    searchCountries: 'Search countries...',
    noCountriesFound: 'No countries found',
  },
  citySelector: {
    selectCity: 'Select a city',
    searchCities: 'Search cities...',
    noCitiesFound: 'No cities found',
    enterCity: 'Enter city name',
  },
  phoneInput: {
    selectCountry: 'Select country',
    searchCountries: 'Search by country, code, or phone code...',
    noCountriesFound: 'No countries found',
    enterPhoneNumber: 'Enter phone number',
  },
  multiSelect: {
    selectOptions: 'Select options',
    searchOptions: 'Search options...',
    noResults: 'No results found.',
    selectAll: 'Select All',
    clear: 'Clear',
    close: 'Close',
    selectedCount: '{{count}} selected',
    moreSelected: '+ {{count}} more',
    // Accessibility messages
    multiSelectDropdown:
      'Multi-select dropdown. Use arrow keys to navigate, Enter to select, and Escape to close.',
    noOptionsSelected: 'No options selected',
    optionSelected: '{{count}} option{{s}} selected: {{options}}',
    optionSelectedSingle:
      '{{option}} selected. {{selected}} of {{total}} options selected.',
    optionsSelectedMultiple:
      '{{count}} options selected. {{selected}} of {{total}} total selected.',
    optionRemoved:
      'Option removed. {{selected}} of {{total}} options selected.',
    dropdownOpened:
      'Dropdown opened. {{total}} options available. Use arrow keys to navigate.',
    dropdownClosed: 'Dropdown closed.',
    searchResults: '{{count}} option{{s}} found for "{{query}}"',
    removeFromSelection: 'Remove {{option}} from selection',
    clearAllSelected: 'Clear all {{count}} selected options',
    selectAllOptions: 'Select all {{count}} options',
    searchHelp: 'Type to filter options. Use arrow keys to navigate results.',
  },
};
