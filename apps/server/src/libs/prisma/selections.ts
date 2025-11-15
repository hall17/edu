import { Prisma } from '@api/prisma/generated/prisma/client';
import { QuestionType } from '@edusama/common';
export const userAuthInclude = (options: { branchId?: number } = {}) => {
  return {
    taughtSubjects: true,
    preferences: true,
    branches: { include: { branch: true } },
    devices: {
      where: options.branchId
        ? {
            device: {
              branchId: options.branchId,
            },
          }
        : undefined,
      include: {
        device: true,
      },
    },
    roles: {
      where: options.branchId
        ? {
            role: {
              branchId: options.branchId,
            },
          }
        : undefined,
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: {
                  select: {
                    name: true,
                    module: {
                      select: {
                        code: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        module: true,
      },
    },
  } satisfies Prisma.UserInclude;
};

export const studentInclude = {
  branch: {
    select: {
      id: true,
      name: true,
      logoUrl: true,
      companyId: true,
      company: {
        select: {
          id: true,
          name: true,
          logoUrl: true,
        },
      },
    },
  },
  parent: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
} satisfies Prisma.StudentInclude;

export const parentInclude = {
  branch: {
    select: {
      id: true,
      name: true,
      logoUrl: true,
      companyId: true,
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  students: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      nationalId: true,
    },
  },
} satisfies Prisma.ParentInclude;

export const teacherInclude = {
  branch: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const deviceInclude = {
  branch: true,
  users: {
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  },
} satisfies Prisma.DeviceInclude;

export const deviceAssignmentInclude = {
  device: {
    include: {
      branch: true,
    },
  },
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
} satisfies Prisma.UserDeviceInclude;

export const deviceFindMyDevicesInclude = {
  device: true,
} satisfies Prisma.UserDeviceInclude;

export const roleInclude = {
  _count: {
    select: {
      users: true,
    },
  },
  branch: {
    select: {
      id: true,
      name: true,
    },
  },
  // users: {
  //   include: {
  //     user: {
  //       select: {
  //         id: true,
  //         firstName: true,
  //         lastName: true,
  //         email: true,
  //       },
  //     },
  //   },
  // },
  permissions: {
    include: {
      permission: {
        include: {
          module: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.RoleInclude;

export const titleInclude = {
  users: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
};

export const companyInclude = {
  branches: {
    include: {
      modules: true,
      _count: {
        select: {
          classrooms: true,
          students: true,
        },
      },
    },
  },
} satisfies Prisma.CompanyInclude;

export const branchInclude = {
  _count: {
    select: {
      classrooms: true,
      students: true,
    },
  },
  company: {
    select: {
      id: true,
      name: true,
      logoUrl: true,
    },
  },
  users: {
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  },
  modules: {
    include: {
      module: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  },
  roles: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
  devices: {
    select: {
      id: true,
      serialNumber: true,
      deviceType: true,
      brand: true,
      model: true,
      status: true,
    },
  },
  parents: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  students: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
} satisfies Prisma.BranchInclude;

export const subjectInclude = {
  branch: {
    select: {
      id: true,
      name: true,
    },
  },
  curriculums: {
    orderBy: {
      order: 'asc',
    },
    include: {
      units: {
        orderBy: {
          order: 'asc',
        },
        include: {
          lessons: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      },
      _count: {
        select: {
          units: true,
          integratedClassrooms: true,
          questions: true,
        },
      },
    },
  },
  teachers: {
    include: {
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          status: true,
        },
      },
    },
  },
  _count: {
    select: {
      curriculums: true,
      teachers: true,
      questions: true,
    },
  },
} satisfies Prisma.SubjectInclude;

export const curriculumInclude = {
  subject: {
    include: {
      branch: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  units: {
    orderBy: {
      order: 'asc',
    },
    select: {
      id: true,
      name: true,
      description: true,
      order: true,
      _count: {
        select: {
          lessons: true,
        },
      },
    },
  },
  _count: {
    select: {
      units: true,
    },
  },
} satisfies Prisma.CurriculumInclude;

export const lessonInclude = {
  unit: {
    include: {
      curriculum: {
        include: {
          subject: true,
        },
      },
    },
  },
} satisfies Prisma.LessonInclude;

export const classroomInclude = {
  branch: {
    select: {
      id: true,
      name: true,
    },
  },
  classroomTemplate: {
    select: {
      id: true,
      name: true,
    },
  },
  modules: {
    include: {
      module: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  },
  integrations: {
    include: {
      teacher: true,
      subject: {
        select: {
          id: true,
          name: true,
          teachers: {
            select: {
              teacher: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
      curriculum: {
        select: {
          id: true,
          name: true,
          units: {
            orderBy: {
              order: 'asc',
            },
            include: {
              lessons: {
                orderBy: {
                  order: 'asc',
                },
                select: {
                  id: true,
                  name: true,
                  description: true,
                  order: true,
                },
              },
            },
          },
        },
      },
      schedules: true,
      classroomIntegrationSessions: {
        orderBy: {
          endDate: 'desc',
        },
        include: {
          lessons: {
            orderBy: {
              lesson: {
                order: 'asc',
              },
            },
            select: {
              lesson: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          attendanceRecords: true,
        },
      },
    },
  },
  students: {
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  },
  _count: {
    select: {
      students: true,
      integrations: true,
      announcements: true,
      modules: true,
    },
  },
} satisfies Prisma.ClassroomInclude;

export const classroomIntegrationInclude = {
  classroom: {
    include: {
      _count: {
        select: {
          students: true,
        },
      },
    },
  },
  subject: {
    select: {
      id: true,
      name: true,
    },
  },
  curriculum: {
    select: {
      id: true,
      name: true,
    },
  },
  teacher: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  schedules: true,
  classroomIntegrationSessions: {
    include: {
      lessons: {
        orderBy: {
          lesson: {
            order: 'asc',
          },
        },
        select: {
          lesson: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      attendanceRecords: {
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.ClassroomIntegrationInclude;

export const classroomIntegrationIncludeFindOne = {
  classroom: {
    include: {
      students: {
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          students: true,
        },
      },
    },
  },
  subject: {
    select: {
      id: true,
      name: true,
      teachers: {
        select: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  },
  curriculum: {
    select: {
      id: true,
      name: true,
      units: {
        orderBy: {
          order: 'asc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          order: true,
          lessons: {
            orderBy: {
              order: 'asc',
            },
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
  teacher: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  schedules: true,
  classroomIntegrationSessions: {
    include: {
      lessons: {
        orderBy: {
          lesson: {
            order: 'asc',
          },
        },
        select: {
          lesson: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      attendanceRecords: {
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.ClassroomIntegrationInclude;

export const classroomIntegrationSessionInclude = {
  classroomIntegration: {
    select: {
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  },
  lessons: {
    orderBy: {
      lesson: {
        order: 'asc',
      },
    },
    select: {
      lesson: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  teacher: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  attendanceRecords: {
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  },
} satisfies Prisma.ClassroomIntegrationSessionInclude;

export const classroomStudentInclude = {
  student: {
    include: {
      classrooms: {
        select: {
          classroomId: true,
        },
      },
    },
  },
} satisfies Prisma.ClassroomStudentInclude;

export const classroomTemplateInclude = {
  branch: {
    select: {
      id: true,
      name: true,
    },
  },
  modules: {
    include: {
      module: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  },
  classrooms: {
    select: {
      id: true,
      name: true,
    },
  },
  _count: {
    select: {
      classrooms: true,
    },
  },
} satisfies Prisma.ClassroomTemplateInclude;

export function getQuestionInclude(types?: QuestionType[]) {
  return {
    subject: {
      include: {
        _count: {
          select: {
            questions: {
              where: types
                ? {
                    type: { in: types },
                  }
                : undefined,
            },
          },
        },
      },
    },
    curriculum: {
      include: {
        _count: {
          select: {
            questions: {
              where: types
                ? {
                    type: { in: types },
                  }
                : undefined,
            },
          },
        },
      },
    },
    lesson: {
      include: {
        _count: {
          select: {
            questions: {
              where: types
                ? {
                    type: { in: types },
                  }
                : undefined,
            },
          },
        },
      },
    },
    responses: {
      select: {
        id: true,
      },
    },
    _count: {
      select: {
        assessmentQuestions: true,
      },
    },
  } satisfies Prisma.QuestionInclude;
}
