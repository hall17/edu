import {
  EssayQuestionData,
  FillInBlankQuestionData,
  MatchingQuestionData,
  MODULE_CODES,
  OrderingQuestionData,
  PERMISSIONS,
  ShortAnswerQuestionData,
  SYSTEM_ROLES,
  TrueFalseQuestionData,
} from '@edusama/common';
import { MultipleChoiceQuestionData } from '@edusama/common';
import { fakerTR as faker } from '@faker-js/faker';
import {
  AssignmentStatus,
  DeviceCondition,
  DeviceStatus,
  Gender,
  Prisma,
} from '@api/prisma/generated/prisma/client';
import { hash } from 'bcrypt';
import dayjs from 'dayjs';

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import { prisma } from '../libs/prisma';

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
  const modules: Prisma.ModuleCreateManyInput[] = [
    {
      code: MODULE_CODES.branches,
      name: 'Branches',
      description: 'Branches module',
      canBeDeleted: false,
      isDefault: true,
    },
    {
      code: MODULE_CODES.modules,
      name: 'Modules',
      description: 'Modules module',
      canBeDeleted: false,
      isDefault: true,
    },
    {
      code: MODULE_CODES.usersAndRoles,
      name: 'Users and Roles',
      description: 'Users and roles module',
      canBeDeleted: false,
      isDefault: true,
    },
    {
      code: MODULE_CODES.profile,
      name: 'Profile',
      description: 'Profile module',
      canBeDeleted: false,
      isDefault: true,
    },
    {
      code: MODULE_CODES.teachers,
      name: 'Teachers',
      description: 'Teachers module',
      canBeDeleted: false,
      isDefault: true,
    },
    {
      code: MODULE_CODES.students,
      name: 'Students',
      description: 'Students module',
      canBeDeleted: false,
      isDefault: true,
    },
    {
      code: MODULE_CODES.parents,
      name: 'Parents',
      description: 'Parents module',
      canBeDeleted: false,
      isDefault: true,
    },
    {
      code: MODULE_CODES.classrooms,
      name: 'Classrooms',
      description: 'Classrooms module',
      canBeDeleted: false,
      isDefault: false,
    },
    {
      code: MODULE_CODES.materials,
      name: 'Materials',
      description: 'Materials module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.assessment,
      name: 'Assessment',
      description: 'Assessment module',
      canBeDeleted: false,
      isDefault: true,
    },
    {
      code: MODULE_CODES.liveStreamSettings,
      name: 'Live Stream Settings',
      description: 'Live stream settings module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.attendance,
      name: 'Attendance',
      description: 'Attendance module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.assignments,
      name: 'Assignments',
      description: 'Assignments module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.recordedLiveClasses,
      name: 'Recorded Live Classes',
      description: 'Recorded live classes module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.certificates,
      name: 'Certificates',
      description: 'Certificates module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.accounting,
      name: 'Accounting',
      description: 'Accounting module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.paymentGateways,
      name: 'Payment Gateways',
      description: 'Payment gateways module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.payments,
      name: 'Payments',
      description: 'Payments module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.productsAndServices,
      name: 'Products and Services',
      description: 'Products and services module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.onlineStore,
      name: 'Online Store',
      description: 'Online store module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.videoCourses,
      name: 'Video Courses',
      description: 'Video courses module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.inventory,
      name: 'Inventory',
      description: 'Inventory module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.agreements,
      name: 'Agreements',
      description: 'Agreements module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.humanResources,
      name: 'Human Resources',
      description: 'Human resources module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.smartReports,
      name: 'Smart Reports',
      description: 'Smart reports module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.announcements,
      name: 'Announcements',
      description: 'Announcements module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.helpDesk,
      name: 'Help Desk',
      description: 'Help desk module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.notifications,
      name: 'Notifications',
      description: 'Notifications module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.settings,
      name: 'Settings',
      description: 'Settings module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.aiMentor,
      name: 'AI Mentor (Recommendation)',
      description: 'AI mentor (recommendation) module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.aiChat,
      name: 'AI Chat',
      description: 'AI chat module',
      canBeDeleted: false,
    },
    {
      code: MODULE_CODES.aiAutoMaterialCreation,
      name: 'AI Auto Material Creation',
      description: 'AI auto material creation module',
      canBeDeleted: false,
    },
  ].map((module, index) => ({
    ...module,
    id: index + 1,
  }));

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

  const subjects: Record<
    string,
    Prisma.SubjectUncheckedCreateInput & { id: string }
  > = {
    japan: {
      id: crypto.randomUUID(),
      name: 'Japonca',
      description: 'Japonca dersi',
      branchId: edusamaCompany.branches[0].id,
    },
    math: {
      id: crypto.randomUUID(),
      name: 'Matematik',
      description: 'Matematik dersi',
      branchId: edusamaCompany.branches[0].id,
    },
    english: {
      id: crypto.randomUUID(),
      name: 'İngilizce',
      description: 'İngilizce dersi',
      branchId: edusamaCompany.branches[0].id,
    },
  };

  await Promise.all(
    Object.entries(subjects).map(([_key, subject]) =>
      prisma.subject.create({
        data: subject,
      })
    )
  );

  const japanCurriculums = {
    n1: {
      id: crypto.randomUUID(),
      name: 'N1',
      description: 'N1 dersi',
      subjectId: subjects.japan.id,
      lessons: {
        createMany: {
          data: [
            {
              id: crypto.randomUUID(),
              name: 'Lesson 1',
              description: 'Lesson 1 description',
              order: 0,
            },
            {
              id: crypto.randomUUID(),
              name: 'Lesson 2',
              description: 'Lesson 2 description',
              order: 1,
            },
            {
              id: crypto.randomUUID(),
              name: 'Lesson 3',
              description: 'Lesson 3 description',
              order: 2,
            },
          ],
        },
      },
    },
    n2: {
      id: crypto.randomUUID(),
      name: 'N2',
      description: 'N2 dersi',
      subjectId: subjects.japan.id,
      lessons: {
        createMany: {
          data: [
            {
              name: 'Lesson 1',
              description: 'Lesson 1 description',
              order: 0,
            },
            {
              name: 'Lesson 2',
              description: 'Lesson 2 description',
              order: 1,
            },
            {
              name: 'Lesson 3',
              description: 'Lesson 3 description',
              order: 2,
            },
          ],
        },
      },
    },
    n3: {
      id: crypto.randomUUID(),
      name: 'N3',
      description: 'N3 dersi',
      subjectId: subjects.japan.id,
      lessons: {
        createMany: {
          data: [
            {
              name: 'Lesson 1',
              description: 'Lesson 1 description',
              order: 0,
            },
            {
              name: 'Lesson 2',
              description: 'Lesson 2 description',
              order: 1,
            },
            {
              name: 'Lesson 3',
              description: 'Lesson 3 description',
              order: 2,
            },
          ],
        },
      },
    },
    n4: {
      id: crypto.randomUUID(),
      name: 'N4',
      description: 'N4 dersi',
      subjectId: subjects.japan.id,
      lessons: {
        createMany: {
          data: [
            {
              name: 'Lesson 1',
              description: 'Lesson 1 description',
              order: 0,
            },
            {
              name: 'Lesson 2',
              description: 'Lesson 2 description',
              order: 1,
            },
            {
              name: 'Lesson 3',
              description: 'Lesson 3 description',
              order: 2,
            },
          ],
        },
      },
    },
    n5: {
      id: crypto.randomUUID(),
      name: 'N5',
      description: 'N5 dersi',
      subjectId: subjects.japan.id,
      lessons: {
        createMany: {
          data: [
            {
              name: 'Lesson 1',
              description: 'Lesson 1 description',
              order: 0,
            },
            {
              name: 'Lesson 2',
              description: 'Lesson 2 description',
              order: 1,
            },
            {
              name: 'Lesson 3',
              description: 'Lesson 3 description',
              order: 2,
            },
          ],
        },
      },
    },
  };

  await Promise.all(
    Object.entries(japanCurriculums).map(([_key, curriculum]) =>
      prisma.curriculum.create({
        data: curriculum,
      })
    )
  );

  const mathCurriculums: Record<string, Prisma.CurriculumUncheckedCreateInput> =
    {
      primary: {
        name: 'Primary',
        description: 'Primary dersi',
        subjectId: subjects.math.id,
        lessons: {
          createMany: {
            data: [
              {
                name: 'Lesson 1',
                description: 'Lesson 1 description',
                order: 0,
              },
              {
                name: 'Lesson 2',
                description: 'Lesson 2 description',
                order: 1,
              },
            ],
          },
        },
      },
      secondary: {
        name: 'Secondary',
        description: 'Secondary dersi',
        subjectId: subjects.math.id,
        lessons: {
          createMany: {
            data: [
              {
                name: 'Lesson 1',
                description: 'Lesson 1 description',
                order: 0,
              },
              {
                name: 'Lesson 2',
                description: 'Lesson 2 description',
                order: 1,
              },
            ],
          },
        },
      },
    };

  await Promise.all(
    Object.entries(mathCurriculums).map(([_key, curriculum]) =>
      prisma.curriculum.create({
        data: curriculum,
      })
    )
  );

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

  // const devices: Prisma.DeviceCreateManyInput[] = Array.from(
  //   { length: 10 },
  //   () => ({
  //     serialNumber: faker.string.uuid(),
  //     assetTag: faker.string.uuid(),
  //     status: 'ASSIGNED',
  //     deviceType: 'LAPTOP',
  //     brand: faker.company.name(),
  //     model: faker.commerce.productName(),
  //     branchId: rootBranch.id,
  //   }),
  // );

  const rootBranch = edusamaCompany.branches[0];
  const osaAcademyBranches = osaAcademy.branches;

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

  const password = '123';

  const admins: Prisma.UserCreateInput[] = [
    {
      id: crypto.randomUUID(),
      email: 'superadmin@edusama.com',
      password: await hash(password, 10),
      firstName: 'Super',
      lastName: 'Admin',
      branches: {
        create: {
          branchId: rootBranch.id,
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
          branchId: rootBranch.id,
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
              branchId: rootBranch.id,
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
              branchId: rootBranch.id,
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
              branchId: rootBranch.id,
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
          branchId: rootBranch.id,
        },
      },
      roles: {
        create: {
          roleId: branchManagerRole.id,
        },
      },
    },
  ];

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
            branchId: rootBranch.id,
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
            branchId: rootBranch.id,
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
            branchId: rootBranch.id,
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

  const teachers: Prisma.UserCreateInput[] = await Promise.all(
    Array.from({ length: 10 }, async () => {
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
        taughtSubjects: {
          create: {
            subjectId: subjects.japan.id,
          },
        },
        branches: {
          create: {
            branchId: rootBranch.id,
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

  const parents: Prisma.ParentCreateManyInput[] = await Promise.all(
    Array.from({ length: 20 }, async () => {
      const { phoneCountryCode, phoneNumber } = generatePhoneData();
      return {
        id: crypto.randomUUID(),
        email: faker.internet.email(),
        password: await hash(password, 10),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        branchId: rootBranch.id,
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
    Array.from({ length: 20 }, async () => {
      const { phoneCountryCode, phoneNumber } = generatePhoneData();
      return {
        id: crypto.randomUUID(),
        email: faker.internet.email(),
        password: await hash(password, 10),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        branchId: rootBranch.id,
        parentId: faker.helpers.arrayElement(parents).id,
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

  await prisma.$transaction(
    [
      ...admins,
      ...branchManagers,
      ...moduleManagers,
      ...staffs,
      ...teachers,
    ].map((data) => prisma.user.create({ data }))
  );

  await prisma.parent.createMany({
    data: parents,
  });

  await prisma.student.createMany({
    data: students,
  });

  const classroom = await prisma.classroom.create({
    data: {
      name: 'Test Classroom',
      capacity: 10,
      startDate: new Date(),
      endDate: new Date(),
      branchId: edusamaCompany.branches[0].id,
      classroomTemplateId: null,
      status: 'ACTIVE',
      assessmentScorePass: 80,
      attendanceThreshold: 80,
      reminderFrequency: 1,
      students: {
        createMany: {
          data: students.slice(0, 10).map((student) => ({
            studentId: student.id!,
          })),
        },
      },
      integrations: {
        create: {
          subjectId: subjects.japan.id,
          curriculumId: japanCurriculums.n1.id,
          teacherId: teachers[0].id!,
          schedules: {
            createMany: {
              data: [
                {
                  dayOfWeek: 'MONDAY',
                  startTime: new Date(Date.UTC(1970, 0, 1, 9, 0, 0, 0)),
                  endTime: new Date(Date.UTC(1970, 0, 1, 10, 0, 0, 0)),
                },
                {
                  dayOfWeek: 'TUESDAY',
                  startTime: new Date(Date.UTC(1970, 0, 1, 9, 0, 0, 0)),
                  endTime: new Date(Date.UTC(1970, 0, 1, 10, 0, 0, 0)),
                },
                {
                  dayOfWeek: 'WEDNESDAY',
                  startTime: new Date(Date.UTC(1970, 0, 1, 9, 0, 0, 0)),
                  endTime: new Date(Date.UTC(1970, 0, 1, 10, 0, 0, 0)),
                },
              ],
            },
          },
          // classroomIntegrationSessions: {
          //   createMany: {
          //     data:
          //       (
          //         japanCurriculums.n1.lessons!.createMany!
          //           .data as Prisma.LessonCreateManyCurriculumInput[]
          //       ).map((lesson, index) => ({
          //         lessons: {
          //           createMany: {
          //             data: [
          //               {
          //                 lessonId: lesson.id!,
          //               },
          //             ],
          //           },
          //         },
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
          //       })) ?? [],
          //   },
          // },
        },
      },
    },
    include: {
      integrations: true,
    },
  });

  const n1Lessons = japanCurriculums.n1.lessons!.createMany!
    .data as Prisma.LessonCreateManyCurriculumInput[];

  await Promise.all(
    n1Lessons.map((lesson, index) =>
      prisma.classroomIntegrationSession.create({
        data: {
          lessons: {
            createMany: {
              data:
                index === 1
                  ? [{ lessonId: lesson.id! }, { lessonId: n1Lessons[0].id! }]
                  : [{ lessonId: lesson.id! }],
            },
          },
          classroomIntegrationId: classroom.integrations[0].id!,
          teacherId: teachers[0].id!,
          description: faker.lorem.sentence(),
          startDate: dayjs()
            .subtract(10 - index, 'day')
            .set('hour', 9)
            .set('minute', 0)
            .toDate(), // 10 days ago at 9:00
          endDate: dayjs()
            .subtract(10 - index, 'day')
            .set('hour', 11)
            .set('minute', 0)
            .toDate(), // 10 days ago at 10:00
        },
      })
    )
  );

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
      branchId: rootBranch.id,
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

  await prisma.question.createManyAndReturn({
    data: [
      // Multiple choice question
      {
        id: 'uuid-1',
        type: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionText:
          "Choose the correct form of the verb: 'She _____ to school every day.'",
        questionData: {
          options: ['go', 'goes', 'going', 'went'],
          correctAnswers: [1],
          multipleChoiceType: 'SINGLE_ANSWER',
        } satisfies MultipleChoiceQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-2',
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: "Which word is a synonym for 'happy'?",
        questionData: {
          options: ['Sad', 'Joyful', 'Angry', 'Tired'],
          correctAnswers: [1],
          multipleChoiceType: 'SINGLE_ANSWER',
        } satisfies MultipleChoiceQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-3',
        type: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionText:
          'Which of the following can be used as both nouns and verbs?',
        questionData: {
          options: ['Run', 'Book', 'Swim', 'Jump'],
          correctAnswers: [0, 1, 2, 3],
          multipleChoiceType: 'MULTIPLE_ANSWERS',
        } satisfies MultipleChoiceQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-4',
        type: 'TRUE_FALSE',
        difficulty: 'MEDIUM',
        questionText:
          "According to the text: 'The main character decides to quit his job and travel the world.'",
        questionData: {
          correctAnswers: ['true'],
        } satisfies TrueFalseQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-5',
        type: 'SHORT_ANSWER',
        difficulty: 'HARD',
        questionText:
          'Describe your favorite childhood memory in 3-4 sentences.',
        questionData: {
          correctAnswers: [], // Manually graded - no predefined correct answer
        } satisfies ShortAnswerQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-6',
        type: 'SHORT_ANSWER',
        difficulty: 'MEDIUM',
        questionText: "Use the word 'serendipity' in a sentence.",
        questionData: {
          correctAnswers: [],
        } satisfies ShortAnswerQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-7',
        type: 'MATCHING',
        difficulty: 'MEDIUM',
        questionText: 'Match the literary devices with their definitions',
        questionData: {
          pairs: {
            leftColumn: [
              'Metaphor',
              'Simile',
              'Personification',
              'Alliteration',
            ],
            rightColumn: [
              'Giving human qualities to non-human things',
              'Repetition of initial sounds in words',
              "Direct comparison using 'like' or 'as'",
              "Direct comparison without 'like' or 'as'",
            ],
          },
          correctAnswers: {
            0: 3, // Metaphor -> Direct comparison without like/as
            1: 2, // Simile -> Direct comparison using like/as
            2: 0, // Personification -> Giving human qualities
            3: 1, // Alliteration -> Repetition of initial sounds
          },
        } satisfies MatchingQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-8',
        type: 'FILL_IN_BLANK',
        difficulty: 'EASY',
        questionText: 'She is afraid of/from spiders.',
        questionData: {
          correctAnswers: [3],
        } satisfies FillInBlankQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-9',
        type: 'FILL_IN_BLANK',
        difficulty: 'MEDIUM',
        questionText: 'I saw an elephant at the zoo yesterday.',
        questionData: {
          correctAnswers: [2, 4],
        } satisfies FillInBlankQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-10',
        type: 'FILL_IN_BLANK',
        difficulty: 'HARD',
        questionText: 'The meeting was called off because the CEO was sick.',
        questionData: {
          correctAnswers: [3],
        } satisfies FillInBlankQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-11',
        type: 'ORDERING',
        difficulty: 'MEDIUM',
        questionText: 'Arrange the words to form a correct question',
        questionData: {
          options: ['you', 'do', 'like', 'coffee', '?'],
          correctAnswers: [1, 0, 2, 3, 4], // "Do you like coffee?"
        } satisfies OrderingQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-12',
        type: 'ORDERING',
        difficulty: 'HARD',
        questionText:
          'Arrange the sentences in logical order to form a coherent paragraph',
        questionData: {
          options: [
            'Finally, the invention was patented and became widely used.',
            'In 1876, Alexander Graham Bell worked on a new device.',
            'He faced many technical challenges during development.',
            'His telephone revolutionized global communication.',
          ],
          correctAnswers: [1, 2, 0, 3],
        } satisfies OrderingQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      // essay questions
      {
        id: 'uuid-13',
        type: 'ESSAY',
        difficulty: 'HARD',
        questionText:
          "Analyze how Shakespeare uses foreshadowing in 'Romeo and Juliet' to build tension. Use specific examples from the text to support your analysis.",
        questionData: {
          correctAnswers: [],
        } satisfies EssayQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-14',
        type: 'ESSAY',
        difficulty: 'MEDIUM',
        questionText:
          'Do you think social media has a positive or negative impact on society? Write an essay defending your position with examples.',
        questionData: {
          correctAnswers: [],
        } satisfies EssayQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-15',
        type: 'ESSAY',
        difficulty: 'MEDIUM',
        questionText:
          'Write a short story (200-300 words) about a character who discovers they have a superpower. Describe how this changes their daily life.',
        questionData: {
          correctAnswers: [],
        } satisfies EssayQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-16',
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionText: 'Which sentence is in present simple tense?',
        questionData: {
          options: [
            'She is eating lunch.',
            'She eats lunch every day.',
            'She will eat lunch.',
            'She ate lunch yesterday.',
          ],
          correctAnswers: [1],
          multipleChoiceType: 'SINGLE_ANSWER',
        } satisfies MultipleChoiceQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-17',
        type: 'FILL_IN_BLANK',
        difficulty: 'MEDIUM',
        questionText: 'He works (work) at the hospital as a doctor.',
        questionData: {
          correctAnswers: [1],
        } satisfies FillInBlankQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
      {
        id: 'uuid-18',
        type: 'MATCHING',
        difficulty: 'EASY',
        questionText: 'Match the job titles with their workplaces',
        questionData: {
          pairs: {
            leftColumn: ['Teacher', 'Doctor', 'Chef'],
            rightColumn: ['Restaurant', 'School', 'Hospital'],
          },
          correctAnswers: { 1: 0, 2: 2, 3: 1 },
        } satisfies MatchingQuestionData,
        subjectId: subjects.japan.id,
        curriculumId: japanCurriculums.n1.id,
        lessonId: japanCurriculums.n1.lessons!.createMany!.data[0].id!,
      },
    ],
  });

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
