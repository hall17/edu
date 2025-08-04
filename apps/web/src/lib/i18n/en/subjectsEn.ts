export const subjects = {
  title: 'Subjects',
  description: 'Manage your subjects and their information here.',
  buttons: {
    addSubject: 'Add Subject',
  },
  table: {
    filterPlaceholder: 'Filter subjects...',
    noResults: 'No results.',
    name: 'Name',
    branch: 'Branch',
    curriculums: 'Curriculums',
    curriculum: 'curriculum',
    curriculumsCount: '{{count}} curriculums',
    createdAt: 'Created At',
    statusChangeWarning:
      "Changing the status will affect the subject's availability and related activities.",
    actions: {
      view: 'View',
      edit: 'Edit',
      suspend: 'Suspend',
      activate: 'Activate',
      delete: 'Delete',
    },
  },
  updateStatusSuccess: 'Subject status updated successfully',
  updateStatusError: 'Failed to update subject status',
  actionDialog: {
    createTitle: 'Create New Subject',
    editTitle: 'Edit Subject',
    createDescription: "Create new subject here. Click save when you're done.",
    editDescription: "Update the subject here. Click save when you're done.",
    tabs: {
      basic: 'Basic Information',
      curriculum: 'Curriculum',
    },
    createSuccess: 'Subject created successfully',
    updateSuccess: 'Subject updated successfully',
    createError: 'Failed to create subject',
    updateError: 'Failed to update subject',
    addCurriculum: 'Add Curriculum',
    addLesson: 'Add Lesson',
    lessons: 'Lessons',
    lessonsCount: '{{count}} lessons',
  },
  viewDialog: {
    description: 'View detailed information about this subject.',
    basicInfo: 'Basic Information',
    curriculums: 'Curriculums',
    createdAt: 'Created on {{date}}',
    lessons: 'lessons',
    statistics: 'Statistics',
    totalCurriculums: 'Total Curriculums',
    totalLessons: 'Total Lessons',
    createdYear: 'Created Year',
    noCurriculums: 'No curriculums found for this subject.',
  },
  deleteDialog: {
    title: 'Delete Subject',
    description:
      'This will permanently delete the subject "{{name}}". This action cannot be undone.',
    warning:
      'This subject has {{count}} curriculums that will also be deleted.',
    deleteSuccess: 'Subject deleted successfully',
    deleteError: 'Failed to delete subject',
  },
  suspendDialog: {
    title: 'Suspend Subject',
    suspendTitle: 'Suspend Subject',
    activateTitle: 'Activate Subject',
    description: 'Suspend this subject account to temporarily restrict access.',
    suspendDescription:
      'Suspend this subject account to temporarily restrict access.',
    activateDescription:
      'Activate this subject account to restore access to the system.',
    confirmMessage:
      'Subject will be suspended and will not be able to be used in new curriculums. Are you sure you want to proceed?',
    suspendedMessage:
      'Subject will be reactivated and will regain access to the system. Are you sure you want to proceed?',
    warningTitle: 'Warning!',
    warningDescription:
      "This action will change the subject's status. You can revert this action later.",
    statusUpdateReasonLabel: 'Reason for suspension',
    statusUpdateReasonPlaceholder:
      'Please provide a reason for suspending this subject...',
    statusUpdateReasonRequired: 'Suspended reason is required',
    confirmButtonText: 'Suspend',
    suspendButtonText: 'Suspend',
    activateButtonText: 'Activate',
    cancel: 'Cancel',
    successMessage: 'Subject status updated successfully',
    errorMessage: 'Failed to update subject status. Please try again.',
  },
  statusDialog: {
    title: 'Change Subject Status',
    description: 'Change the status for {{name}}.',
    currentStatus: 'Current Status',
    newStatus: 'New Status',
    updateButton: 'Update Status',
    success: 'Subject status updated successfully',
  },
} as const;
