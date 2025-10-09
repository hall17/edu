import {
  AssignmentStatus,
  DeviceCondition,
  DeviceStatus,
  Gender,
  Prisma,
} from '@api/prisma/generated/prisma/client';
import { PERMISSIONS, SYSTEM_ROLES } from '@edusama/common';
import { fakerTR as faker } from '@faker-js/faker';
import { hash } from 'bcrypt';
import dayjs from 'dayjs';
import pLimit from 'p-limit';

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import { prisma } from '../libs/prisma';

import { modules } from './seed/modules';
import { generateSubjects } from './seed/subjects';

const password = '123';
const limit = pLimit(10);

// Helper functions for realistic social media URLs
function generateFacebookUrl() {
  const patterns = [
    () => {
      const username = faker.internet
        .username()
        .toLowerCase()
        .replace(/[^a-z0-9._]/g, '');
      return `https://facebook.com/${username}`;
    },
    () => {
      const id = faker.string.numeric({ length: 15 });
      return `https://facebook.com/profile.php?id=${id}`;
    },
    () => {
      const name = faker.person
        .fullName()
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '');
      return `https://facebook.com/${name}`;
    },
  ];

  return faker.helpers.arrayElement(patterns)();
}

function generateInstagramUrl() {
  const username = faker.internet
    .username()
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, '');
  return `https://instagram.com/${username}`;
}

function generateTwitterUrl() {
  const username = faker.internet
    .username()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
  return `https://twitter.com/${username}`;
}

function generateLinkedInUrl() {
  const patterns = [
    () => {
      const username = faker.internet
        .username()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      return `https://linkedin.com/in/${username}`;
    },
    () => {
      const companyName = faker.company
        .name()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      return `https://linkedin.com/company/${companyName}`;
    },
  ];

  return faker.helpers.arrayElement(patterns)();
}

function generateSocialLinks() {
  const hasFacebook = faker.datatype.boolean({ probability: 0.7 });
  const hasInstagram = faker.datatype.boolean({ probability: 0.8 });
  const hasTwitter = faker.datatype.boolean({ probability: 0.6 });
  const hasLinkedIn = faker.datatype.boolean({ probability: 0.5 });

  return {
    facebookLink: hasFacebook ? generateFacebookUrl() : null,
    instagramLink: hasInstagram ? generateInstagramUrl() : null,
    twitterLink: hasTwitter ? generateTwitterUrl() : null,
    linkedinLink: hasLinkedIn ? generateLinkedInUrl() : null,
  };
}

// let prisma: PrismaClient;

async function createRoot() {
  await prisma.module.createMany({
    data: modules,
  });

  // read-write-delete permissions for each module
  const permissions: Prisma.PermissionCreateManyInput[] = modules.flatMap(
    (module) => {
      const moduleId = module.id!;
      return Object.values(PERMISSIONS).map((permission) => ({
        id: crypto.randomUUID(),
        name: permission,
        moduleId,
      }));
    }
  );

  await prisma.permission.createMany({
    data: permissions,
  });

  const osaAcademy = await prisma.company.create({
    data: {
      name: 'Osa Academy',
      slug: 'osa-academy',
      branches: {
        createMany: {
          data: [
            {
              name: 'Tokyo Branch',
              slug: 'tokyo',
            },
            {
              name: 'Osaka Branch',
              slug: 'osaka',
            },
            {
              name: 'Kyoto Branch',
              slug: 'kyoto',
            },
            {
              name: 'Fukuoka Branch',
              slug: 'fukuoka',
            },
          ],
        },
      },
    },
    include: {
      branches: true,
    },
  });

  const osaAcademyBranches = osaAcademy.branches;

  await prisma.role.createManyAndReturn({
    data: [
      {
        name: 'Custom Role',
        description: 'Custom role description',
        branchId: osaAcademy.branches[0].id,
      },
      {
        name: 'Custom Role 2',
        description: 'Custom role description 2',
        branchId: osaAcademy.branches[1].id,
      },
      {
        name: 'Custom Role 3',
        description: 'Custom role description 3',
        branchId: osaAcademy.branches[2].id,
      },
    ],
  });

  await prisma.branchModule.createMany({
    data: osaAcademy.branches.flatMap((branch) =>
      modules.map((module) => ({
        moduleId: module.id!,
        branchId: branch.id,
      }))
    ),
  });

  const edusamaCompany = await prisma.company.create({
    data: {
      name: 'Edusama',
      slug: 'edusama',
      branches: {
        create: {
          name: 'Edusama',
          slug: 'edusama',
          roles: {
            createMany: {
              data: [
                {
                  code: SYSTEM_ROLES.superAdmin,
                  name: 'Super Admin',
                  description: 'Super admin role',
                  isSystem: true,
                  isVisible: false,
                },
                {
                  code: SYSTEM_ROLES.admin,
                  name: 'Admin',
                  description: 'Admin role',
                  isSystem: true,
                  isVisible: false,
                },
                {
                  code: SYSTEM_ROLES.branchManager,
                  name: 'Branch Manager',
                  description: 'Branch manager role',
                  isSystem: true,
                },
                {
                  code: SYSTEM_ROLES.moduleManager,
                  name: 'Module Manager',
                  description: 'Module manager role',
                  isSystem: true,
                },
                {
                  code: SYSTEM_ROLES.teacher,
                  name: 'Teacher',
                  description: 'Teacher role',
                  isSystem: true,
                },
                {
                  code: SYSTEM_ROLES.staff,
                  name: 'Staff',
                  description: 'Staff role',
                  isSystem: true,
                },
              ],
            },
          },
          modules: {
            createMany: {
              data: modules.map((module, index) => ({
                moduleId: index + 1,
              })),
            },
          },
        },
      },
    },
    include: {
      branches: {
        include: {
          roles: true,
        },
      },
    },
  });

  // const subjects: Record<
  //   string,
  //   Prisma.SubjectUncheckedCreateInput & { id: string }
  // > = {
  //   japan: {
  //     id: crypto.randomUUID(),
  //     name: 'Japonca',
  //     description: 'Japonca dersi',
  //     branchId: edusamaCompany.branches[0].id,
  //   },
  //   math: {
  //     id: crypto.randomUUID(),
  //     name: 'Matematik',
  //     description: 'Matematik dersi',
  //     branchId: edusamaCompany.branches[0].id,
  //   },
  //   english: {
  //     id: crypto.randomUUID(),
  //     name: 'İngilizce',
  //     description: 'İngilizce dersi',
  //     branchId: edusamaCompany.branches[0].id,
  //   },
  // };

  const edusamaMainBranchId = edusamaCompany.branches[0].id;

  const rootBranch = edusamaCompany.branches[0];

  const [superAdminRole] = rootBranch.roles.filter(
    (role) => role.code === SYSTEM_ROLES.superAdmin
  );
  const [adminRole] = rootBranch.roles.filter(
    (role) => role.code === SYSTEM_ROLES.admin
  );
  const [branchManagerRole] = rootBranch.roles.filter(
    (role) => role.code === SYSTEM_ROLES.branchManager
  );
  const [moduleManagerRole] = rootBranch.roles.filter(
    (role) => role.code === SYSTEM_ROLES.moduleManager
  );
  const [teacherRole] = rootBranch.roles.filter(
    (role) => role.code === SYSTEM_ROLES.teacher
  );
  const [staffRole] = rootBranch.roles.filter(
    (role) => role.code === SYSTEM_ROLES.staff
  );

  if (
    !superAdminRole ||
    !adminRole ||
    !branchManagerRole ||
    !moduleManagerRole ||
    !teacherRole ||
    !staffRole
  ) {
    throw new Error('Roles not found');
  }

  function generatePhoneData() {
    const phoneCountryCode = 'TR';
    const phoneNumber = faker.phone.number({ style: 'international' });
    return {
      phoneCountryCode,
      phoneNumber: phoneNumber.replace('+90', ''),
    };
  }

  const branchManagers: Prisma.UserCreateInput[] = await Promise.all(
    Array.from({ length: 3 }, async (_, index) => {
      const { phoneCountryCode, phoneNumber } = generatePhoneData();
      return {
        id: crypto.randomUUID(),
        email: `branchmanager${index + 1}@edusama.com`,
        password: await hash(password, 10),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        gender: faker.helpers.arrayElement(Object.values(Gender)),
        dateOfBirth: faker.date.past(),
        nationalId: faker.string.numeric({ length: 10 }),
        phoneCountryCode: phoneCountryCode,
        phoneNumber: phoneNumber,
        countryCode: 'TR',
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        zipCode: faker.location.zipCode(),
        about: faker.lorem.sentence(),
        ...generateSocialLinks(),
        branches: {
          create: {
            branchId: edusamaMainBranchId,
          },
        },
        roles: {
          create: {
            roleId: branchManagerRole.id,
          },
        },
      } satisfies Prisma.UserCreateInput;
    })
  );

  const moduleManagers: Prisma.UserCreateInput[] = await Promise.all(
    Array.from({ length: modules.length }, async (_, index) => {
      const { phoneCountryCode, phoneNumber } = generatePhoneData();
      return {
        id: crypto.randomUUID(),
        email: `modulemanager${index + 1}@edusama.com`,
        password: await hash(password, 10),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        gender: faker.helpers.arrayElement(Object.values(Gender)),
        dateOfBirth: faker.date.past(),
        nationalId: faker.string.numeric({ length: 10 }),
        phoneCountryCode: phoneCountryCode,
        phoneNumber: phoneNumber,
        countryCode: 'TR',
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        zipCode: faker.location.zipCode(),
        about: faker.lorem.sentence(),
        ...generateSocialLinks(),
        branches: {
          create: {
            branchId: edusamaMainBranchId,
          },
        },
        roles: {
          create: {
            roleId: moduleManagerRole.id,
            moduleId: modules[index].id,
          },
        },
      } satisfies Prisma.UserCreateInput;
    })
  );

  const staffs: Prisma.UserCreateInput[] = await Promise.all(
    Array.from({ length: 10 }, async (_, index) => {
      const { phoneCountryCode, phoneNumber } = generatePhoneData();
      return {
        id: crypto.randomUUID(),
        email: `staff${index + 1}@edusama.com`,
        password: await hash(password, 10),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        gender: faker.helpers.arrayElement(Object.values(Gender)),
        dateOfBirth: faker.date.past(),
        nationalId: faker.string.numeric({ length: 10 }),
        phoneCountryCode: phoneCountryCode,
        phoneNumber: phoneNumber,
        countryCode: 'TR',
        state: faker.location.state(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        zipCode: faker.location.zipCode(),
        about: faker.lorem.sentence(),
        ...generateSocialLinks(),
        branches: {
          create: {
            branchId: edusamaMainBranchId,
          },
        },
        roles: {
          create: {
            roleId: staffRole.id,
          },
        },
      } satisfies Prisma.UserCreateInput;
    })
  );

  const parents: Prisma.ParentCreateManyInput[] = await Promise.all(
    Array.from({ length: 100 }, async () => {
      const { phoneCountryCode, phoneNumber } = generatePhoneData();
      return {
        id: crypto.randomUUID(),
        email: faker.internet.email(),
        password: await hash(password, 10),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        branchId: edusamaMainBranchId,
        gender: faker.helpers.arrayElement(Object.values(Gender)),
        dateOfBirth: faker.date.past(),
        nationalId: faker.string.numeric({ length: 10 }),
        phoneCountryCode: phoneCountryCode,
        phoneNumber: phoneNumber,
        countryCode: 'TR',
        state: faker.location.state(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        zipCode: faker.location.zipCode(),
        about: faker.lorem.sentence(),
        ...generateSocialLinks(),
      } satisfies Prisma.ParentCreateManyInput;
    })
  );

  const students: Prisma.StudentCreateManyInput[] = await Promise.all(
    Array.from({ length: 100 }, async (_, index) => {
      const { phoneCountryCode, phoneNumber } = generatePhoneData();
      return {
        id: crypto.randomUUID(),
        email: faker.internet.email(),
        password: await hash(password, 10),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        branchId: edusamaMainBranchId,
        parentId: parents[index].id,
        gender: faker.helpers.arrayElement(Object.values(Gender)),
        dateOfBirth: faker.date.past(),
        nationalId: faker.string.numeric({ length: 10 }),
        phoneCountryCode: phoneCountryCode,
        phoneNumber: phoneNumber,
        countryCode: 'TR',
        state: faker.location.state(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        zipCode: faker.location.zipCode(),
        about: faker.lorem.sentence(),
        ...generateSocialLinks(),
      } satisfies Prisma.StudentCreateManyInput;
    })
  );

  const subjects = generateSubjects(edusamaCompany.branches[0].id);

  const admins: Prisma.UserCreateInput[] = [
    {
      id: crypto.randomUUID(),
      email: 'superadmin@edusama.com',
      password: await hash(password, 10),
      firstName: 'Super',
      lastName: 'Admin',
      branches: {
        create: {
          branchId: edusamaMainBranchId,
        },
      },
      roles: {
        create: {
          roleId: superAdminRole.id,
        },
      },
    },
    {
      id: crypto.randomUUID(),
      email: 'admin@edusama.com',
      password: await hash(password, 10),
      firstName: 'Admin',
      lastName: 'Admin',
      branches: {
        create: {
          branchId: edusamaMainBranchId,
        },
      },
      roles: {
        create: {
          roleId: adminRole.id,
        },
      },
    },
    {
      id: crypto.randomUUID(),
      email: 'it@edusama.com',
      password: await hash(password, 10),
      firstName: 'It',
      lastName: 'Super Admin',
      branches: {
        createMany: {
          data: [
            {
              branchId: edusamaMainBranchId,
            },
            ...osaAcademyBranches.map((branch) => ({
              branchId: branch.id,
            })),
          ],
        },
      },
      roles: {
        create: {
          roleId: superAdminRole.id,
        },
      },
    },
    {
      id: crypto.randomUUID(),
      email: 'selcuk.keskin@edusama.com',
      password: await hash(password, 10),
      firstName: 'Selçuk',
      lastName: 'Keskin',
      branches: {
        createMany: {
          data: [
            {
              branchId: edusamaMainBranchId,
            },
            ...osaAcademyBranches.map((branch) => ({
              branchId: branch.id,
            })),
          ],
        },
      },
      roles: {
        create: {
          roleId: superAdminRole.id,
        },
      },
    },
    {
      id: crypto.randomUUID(),
      email: 'erol.ulgu@edusama.com',
      password: await hash(password, 10),
      firstName: 'Erol',
      lastName: 'Ülgü',
      branches: {
        createMany: {
          data: [
            {
              branchId: edusamaMainBranchId,
            },
            ...osaAcademyBranches.map((branch) => ({
              branchId: branch.id,
            })),
          ],
        },
      },
      roles: {
        create: {
          roleId: superAdminRole.id,
        },
      },
    },
    {
      id: crypto.randomUUID(),
      email: 'branchadmin@edusama.com',
      password: await hash(password, 10),
      firstName: 'Branch',
      lastName: 'Admin',
      branches: {
        create: {
          branchId: edusamaMainBranchId,
        },
      },
      roles: {
        create: {
          roleId: branchManagerRole.id,
        },
      },
    },
  ];

  const teachers: Prisma.UserCreateInput[] = await Promise.all(
    Array.from({ length: 20 }, async () => {
      const { phoneCountryCode, phoneNumber } = generatePhoneData();
      return {
        id: crypto.randomUUID(),
        email: faker.internet.email(),
        password: await hash(password, 10),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        gender: faker.helpers.arrayElement(Object.values(Gender)),
        dateOfBirth: faker.date.past(),
        nationalId: faker.string.numeric({ length: 10 }),
        phoneCountryCode: phoneCountryCode,
        phoneNumber: phoneNumber,
        countryCode: 'TR',
        state: faker.location.state(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        zipCode: faker.location.zipCode(),
        about: faker.lorem.sentence(),
        ...generateSocialLinks(),
        // taughtSubjects: {
        //   create: {
        //     subjectId: subjects.japan.id,
        //   },
        // },
        branches: {
          create: {
            branchId: edusamaMainBranchId,
          },
        },
        roles: {
          create: {
            roleId: teacherRole.id,
          },
        },
      } satisfies Prisma.UserCreateInput;
    })
  );

  await Promise.all(
    [
      ...admins,
      ...branchManagers,
      ...moduleManagers,
      ...staffs,
      ...teachers,
    ].map((data) => limit(() => prisma.user.create({ data })))
  );

  await prisma.parent.createMany({
    data: parents,
  });

  await prisma.student.createMany({
    data: students,
  });

  for (const subjectKey of Object.keys(subjects)) {
    const subject = subjects[subjectKey as keyof typeof subjects];
    const { curriculums, ..._ } = subject;

    // create subject
    await prisma.subject.create({
      data: {
        id: subject.id,
        name: subject.name,
        description: subject.description,
        branchId: edusamaMainBranchId,
      },
    });

    // create curriculums and lessons
    for (const curriculum of curriculums) {
      const { lessons, ...curriculumData } = curriculum;
      await prisma.curriculum.create({
        data: {
          ...curriculumData,
          subjectId: subject.id,
        },
      });

      // create lessons
      await prisma.lesson.createMany({
        data: lessons.map((lesson) => {
          const { questions: _, ...lessonData } = lesson;
          return {
            ...lessonData,
            curriculumId: curriculum.id,
          };
        }),
      });

      // create questions
      for (const lesson of lessons) {
        if (lesson.questions) {
          await prisma.question.createMany({
            data: lesson.questions?.map((question) => ({
              ...question,
              subjectId: subject.id,
              curriculumId: curriculum.id,
              lessonId: lesson.id,
            })),
          });
        }
      }
    }

    // take first half of teachers for japan subject
    const randomTenTeachers = faker.helpers.arrayElements(teachers, 10);

    await Promise.all(
      randomTenTeachers.map((data) =>
        prisma.user.update({
          where: { id: data.id },
          data: { taughtSubjects: { create: { subjectId: subject.id } } },
        })
      )
    );
  }

  for (const subject of Object.values(subjects)) {
    for (const curriculum of subject.curriculums) {
      const { lessons, ..._ } = curriculum;
      console.log('curriculum', curriculum.name);
      // create classroom
      const classroom = await prisma.classroom.create({
        data: {
          name: `${curriculum.name} Classroom`,
          capacity: faker.number.int({ min: 10, max: 100 }),
          startDate: faker.date.past(),
          endDate: faker.date.future(),
          branchId: edusamaMainBranchId,
          classroomTemplateId: null,
          status: 'ACTIVE',
          assessmentScorePass: faker.number.int({ min: 50, max: 100 }),
          attendanceThreshold: faker.number.int({ min: 50, max: 100 }),
          reminderFrequency: faker.number.int({ min: 1, max: 10 }),
          students: {
            createMany: {
              data: faker.helpers
                .arrayElements(students, faker.number.int({ min: 10, max: 30 }))
                .map((student) => ({
                  studentId: student.id!,
                })),
            },
          },
          integrations: {
            create: {
              subjectId: subject.id,
              curriculumId: curriculum.id,
              teacherId: faker.helpers.arrayElement(teachers).id!,
              schedules: {
                createMany: {
                  data: [
                    {
                      dayOfWeek: 'MONDAY',
                      startTime: dayjs()
                        .set('hour', 9)
                        .set('minute', 0)
                        .toDate(),
                      endTime: dayjs()
                        .set('hour', 10)
                        .set('minute', 0)
                        .toDate(),
                    },
                    {
                      dayOfWeek: 'TUESDAY',
                      startTime: dayjs()
                        .set('hour', 9)
                        .set('minute', 0)
                        .toDate(),
                      endTime: dayjs()
                        .set('hour', 10)
                        .set('minute', 0)
                        .toDate(),
                    },
                    {
                      dayOfWeek: 'WEDNESDAY',
                      startTime: dayjs()
                        .set('hour', 9)
                        .set('minute', 0)
                        .toDate(),
                      endTime: dayjs()
                        .set('hour', 10)
                        .set('minute', 0)
                        .toDate(),
                    },
                  ],
                },
              },
            },
          },
        },
        select: {
          integrations: {
            select: {
              id: true,
            },
          },
        },
      });

      // create 3 integration sessions and add two lessons from indexes for each
      Array.from({ length: 3 }, async (_, index) => {
        const selectedLessons = lessons!.slice(index * 2, index * 2 + 2);
        await prisma.classroomIntegrationSession.create({
          data: {
            lessons: {
              createMany: {
                data: selectedLessons.map((lesson) => ({
                  lessonId: lesson.id!,
                })),
              },
            },
            classroomIntegrationId: classroom.integrations[0].id!,
            teacherId: teachers[0].id!,
            description: faker.lorem.sentence(),
            startDate: dayjs()
              .subtract(10 - index, 'day')
              .set('hour', 9)
              .set('minute', 0)
              .toDate(),
            endDate: dayjs()
              .subtract(10 - index, 'day')
              .set('hour', 11)
              .set('minute', 0)
              .toDate(),
          },
        });
      });
    }
  }

  // const devices: Prisma.DeviceCreateManyInput[] = Array.from(
  //   { length: 10 },
  //   () => ({
  //     serialNumber: faker.string.uuid(),
  //     assetTag: faker.string.uuid(),
  //     status: 'ASSIGNED',
  //     deviceType: 'LAPTOP',
  //     brand: faker.company.name(),
  //     model: faker.commerce.productName(),
  //     branchId: edusamaMainBranchId,
  //   }),
  // );

  const allReadPermissions = permissions.filter(
    (permission) => permission.name === PERMISSIONS.read
  );

  // const allWriteDeletePermissions = permissions.filter(
  //   (permission) =>
  //     permission.name === PERMISSIONS.write ||
  //     permission.name === PERMISSIONS.delete,
  // );

  await prisma.rolePermission.createMany({
    data: [
      // admin has all permissions
      ...permissions.map((permission) => ({
        roleId: adminRole.id,
        permissionId: permission.id!,
      })),
      // branch manager has all permissions
      ...permissions.map((permission) => ({
        roleId: branchManagerRole.id,
        permissionId: permission.id!,
      })),
      // module manager has all read permissions and write-delete permissions for his own module
      ...permissions.map((permission) => ({
        roleId: moduleManagerRole.id,
        permissionId: permission.id!,
      })),
      // teacher has read permission
      ...allReadPermissions.map((permission) => ({
        roleId: teacherRole.id,
        permissionId: permission.id!,
      })),
      // staff has read permission
      ...allReadPermissions.map((permission) => ({
        roleId: staffRole.id,
        permissionId: permission.id!,
      })),
    ],
  });

  // await Promise.all(
  //   Object.entries(subjects).map(async ([_key, subject]) => {

  //   })
  // );

  // const classroom = await prisma.classroom.create({
  //   data: {
  //     name: 'Test Classroom',
  //     capacity: 10,
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     branchId: edusamaCompany.branches[0].id,
  //     classroomTemplateId: null,
  //     status: 'ACTIVE',
  //     assessmentScorePass: 80,
  //     attendanceThreshold: 80,
  //     reminderFrequency: 1,
  //     students: {
  //       createMany: {
  //         data: students.slice(0, 10).map((student) => ({
  //           studentId: student.id!,
  //         })),
  //       },
  //     },
  //     integrations: {
  //       create: {
  //         subjectId: subjects.japan.id,
  //         curriculumId: japanCurriculums.n1.id,
  //         teacherId: teachers[0].id!,
  //         schedules: {
  //           createMany: {
  //             data: [
  //               {
  //                 dayOfWeek: 'MONDAY',
  //                 startTime: new Date(Date.UTC(1970, 0, 1, 9, 0, 0, 0)),
  //                 endTime: new Date(Date.UTC(1970, 0, 1, 10, 0, 0, 0)),
  //               },
  //               {
  //                 dayOfWeek: 'TUESDAY',
  //                 startTime: new Date(Date.UTC(1970, 0, 1, 9, 0, 0, 0)),
  //                 endTime: new Date(Date.UTC(1970, 0, 1, 10, 0, 0, 0)),
  //               },
  //               {
  //                 dayOfWeek: 'WEDNESDAY',
  //                 startTime: new Date(Date.UTC(1970, 0, 1, 9, 0, 0, 0)),
  //                 endTime: new Date(Date.UTC(1970, 0, 1, 10, 0, 0, 0)),
  //               },
  //             ],
  //           },
  //         },
  //         // classroomIntegrationSessions: {
  //         //   createMany: {
  //         //     data:
  //         //       (
  //         //         japanCurriculums.n1.lessons!.createMany!
  //         //           .data as Prisma.LessonCreateManyCurriculumInput[]
  //         //       ).map((lesson, index) => ({
  //         //         lessons: {
  //         //           createMany: {
  //         //             data: [
  //         //               {
  //         //                 lessonId: lesson.id!,
  //         //               },
  //         //             ],
  //         //           },
  //         //         },
  //         //         teacherId: teachers[0].id!,
  //         //         description: faker.lorem.sentence(),
  //         //         startDate: dayjs()
  //         //           .subtract(10 - index, 'day')
  //         //           .set('hour', 9)
  //         //           .set('minute', 0)
  //         //           .toDate(), // 10 days ago at 9:00
  //         //         endDate: dayjs()
  //         //           .subtract(10 - index, 'day')
  //         //           .set('hour', 11)
  //         //           .set('minute', 0)
  //         //           .toDate(), // 10 days ago at 10:00
  //         //       })) ?? [],
  //         //   },
  //         // },
  //       },
  //     },
  //   },
  //   include: {
  //     integrations: true,
  //   },
  // });

  // const n1Lessons = japanCurriculums.n1.lessons!.createMany!
  //   .data as Prisma.LessonCreateManyCurriculumInput[];

  // await Promise.all(
  //   n1Lessons.map((lesson, index) =>
  //     prisma.classroomIntegrationSession.create({
  //       data: {
  //         lessons: {
  //           createMany: {
  //             data:
  //               index === 1
  //                 ? [{ lessonId: lesson.id! }, { lessonId: n1Lessons[0].id! }]
  //                 : [{ lessonId: lesson.id! }],
  //           },
  //         },
  //         classroomIntegrationId: classroom.integrations[0].id!,
  //         teacherId: teachers[0].id!,
  //         description: faker.lorem.sentence(),
  //         startDate: dayjs()
  //           .subtract(10 - index, 'day')
  //           .set('hour', 9)
  //           .set('minute', 0)
  //           .toDate(), // 10 days ago at 9:00
  //         endDate: dayjs()
  //           .subtract(10 - index, 'day')
  //           .set('hour', 11)
  //           .set('minute', 0)
  //           .toDate(), // 10 days ago at 10:00
  //       },
  //     })
  //   )
  // );

  const devices = await prisma.device.createManyAndReturn({
    data: Array.from({ length: 150 }, () => ({
      serialNumber: faker.string.uuid(),
      assetTag: faker.string.uuid(),
      status: faker.helpers.arrayElement([
        'AVAILABLE',
        'ASSIGNED',
        'IN_REPAIR',
      ]) as DeviceStatus,
      deviceType: 'LAPTOP',
      brand: faker.company.name(),
      model: faker.commerce.productName(),
      branchId: edusamaMainBranchId,
      warrantyExpiry: faker.date.future(),
      purchaseDate: faker.date.past(),
      purchasePrice: faker.number.int({ min: 100, max: 1000 }),
      purchaseCurrency: 'USD',
    })) satisfies Prisma.DeviceCreateManyInput[],
  });

  const assignedDevices = devices.filter(
    (device) => device.status === 'ASSIGNED'
  );

  await prisma.userDevice.createMany({
    data: assignedDevices.map((device) => ({
      status: faker.helpers.arrayElement(Object.values(AssignmentStatus)),
      deviceId: device.id,
      userId: faker.helpers.arrayElement([
        ...admins,
        ...branchManagers,
        ...moduleManagers,
        ...staffs,
        ...teachers,
      ]).id!,
      assignedAt: faker.date.past(),
      assignmentNotes: faker.lorem.sentence(),
      conditionAtAssignment: faker.helpers.arrayElement(
        Object.values(DeviceCondition)
      ),
    })) satisfies Prisma.UserDeviceCreateManyInput[],
  });

  // await prisma.question.createManyAndReturn({
  //   data: generateQuestions({
  //     subjectId: subjects.japan.id,
  //     curriculumId: japanCurriculums.n1.id,
  //     lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
  //   }),
  // });

  // await prisma.user.createMany({
  //   data: admins,
  // });

  // await prisma.user.createMany({
  //   data: branchManagers,
  // });

  // await prisma.user.createMany({
  //   data: moduleManagers,
  // });

  // await prisma.user.createMany({
  //   data: teachers,
  // });

  // await prisma.user.createMany({
  //   data: students,
  // });

  // await prisma.user.createMany({
  //   data: parents,
  // });

  // await prisma.user.createMany({
  //   data: [
  //     ...admins,
  //     ...branchManagers,
  //     ...moduleManagers,
  //     ...teachers,
  //     ...students,
  //     ...parents,
  //   ],
  // });

  return edusamaCompany;
}

export async function seed() {
  // if (parse(process.env.DATABASE_URL as string).host !== 'localhost') {
  //   throw new Error(
  //     'Invalid DATABASE_URL provided. Please provide a local database url.',
  //   );
  // }

  console.log(`DATABASE_URL="${process.env.DATABASE_URL}"`);

  // delete migrations folder if exists
  const migrationsFolder = path.join(__dirname, '.', 'migrations');
  if (fs.existsSync(migrationsFolder)) {
    fs.rmdirSync(migrationsFolder, { recursive: true });
  }

  // reset database
  const databaseResetCommand = 'yarn prisma migrate reset --force';
  console.log(`Resetting database (command: "${databaseResetCommand}").`);
  execSync(databaseResetCommand, { stdio: 'inherit' });

  // run migration
  const migrationCommand = 'yarn prisma migrate dev --name "init"';

  console.log(`Running migration (command: "${migrationCommand}").`);
  execSync(migrationCommand, { stdio: 'inherit' });

  await createRoot();

  console.log('Database initialized successfully.');
}

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  seed()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      process.exit();
    });
}
