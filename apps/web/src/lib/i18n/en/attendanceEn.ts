export const attendance = {
  title: 'Attendance',
  description: 'Track and manage classroom attendance records.',
  table: {
    noResults: 'No attendance records found.',
    classroom: 'Classroom',
    subject: 'Subject',
    curriculum: 'Curriculum',
    teacher: 'Teacher',
    studentsCount: 'Students',
    classroomIntegrationSessionsCount: 'Completed Lessons',
    filterPlaceholder: 'Filter attendance records...',
    filters: {
      classroom: 'Classroom',
      subject: 'Subject',
    },
    actions: {
      view: 'View Details',
    },
  },
} as const;
