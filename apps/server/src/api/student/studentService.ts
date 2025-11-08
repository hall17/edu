import { HTTP_EXCEPTIONS } from '@api/constants';
import emailService from '@api/libs/emailService';
import { prisma } from '@api/libs/prisma';
import { studentInclude } from '@api/libs/prisma/selections';
import { generateSignedUrl } from '@api/libs/s3';
import { Prisma, Student } from '@api/prisma/generated/prisma/client';
import { CustomError, TokenUser } from '@api/types';
import { decrypt, encrypt, generateToken, hasPermission } from '@api/utils';
import { MODULE_CODES, PERMISSIONS } from '@edusama/common';
import { hash } from 'bcrypt';
import ExcelJS from 'exceljs';
import pLimit from 'p-limit';
import { Service } from 'typedi';

import { INVITATION_EXPIRATION_TIME, PAGE_SIZE } from '../../utils/constants';

import {
  StudentCreateDto,
  studentCreateFromExcelSchema,
  StudentFindAllDto,
  StudentUpdateDto,
  StudentUpdateSignupStatusDto,
  StudentUpdateSuspendedDto,
} from './studentModel';

@Service()
export class StudentService {
  async findAll(requestedBy: TokenUser, filterDto: StudentFindAllDto) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.students,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const { q, sort, size = PAGE_SIZE } = filterDto;

    const page = filterDto.page || 0;
    let orderBy: Prisma.StudentOrderByWithRelationInput = {};

    if (sort) {
      const [field, order] = sort.split(':');
      orderBy = {
        [field as keyof Prisma.StudentOrderByWithRelationInput]:
          order as Prisma.SortOrder,
      };
    } else {
      orderBy.updatedAt = 'desc';
    }

    let where: Prisma.StudentWhereInput = {
      deletedAt: null,
      branchId:
        filterDto.global && requestedBy.isSuperAdmin
          ? requestedBy.branchIds.length
            ? { in: requestedBy.branchIds }
            : undefined
          : requestedBy.activeBranchId,
      status: {
        in: filterDto.status || undefined,
      },
      parentId: filterDto.parentId,
    };

    if (q) {
      where = {
        ...where,
        OR: [
          { email: { contains: q, mode: 'insensitive' } },
          { nationalId: { contains: q, mode: 'insensitive' } },
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { phoneNumber: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    const [students, count] = await Promise.all([
      prisma.student.findMany({
        ...(filterDto.all
          ? {}
          : {
              skip: (page - 1) * size,
              take: size,
            }),
        where,
        orderBy,
        include: studentInclude,
      }),
      prisma.student.count({
        where,
      }),
    ]);

    const studentsWithData = await Promise.all(
      students.map(async (student) => {
        return this.createStudentData(requestedBy, student);
      })
    );

    return {
      students: studentsWithData,
      count,
    };
  }

  async findOne(requestedBy: TokenUser, id: string) {
    // Apply permission-based access control
    if (!requestedBy.isSuperAdmin) {
      const userHasReadPermission = hasPermission(
        requestedBy,
        MODULE_CODES.students,
        PERMISSIONS.read
      );

      if (!userHasReadPermission) {
        throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
      }
    }

    const student = await prisma.student.findUnique({
      where: {
        id,
        deletedAt: null,
        branchId: requestedBy.activeBranchId,
      },
      include: studentInclude,
    });

    if (!student) {
      throw new CustomError(HTTP_EXCEPTIONS.STUDENT_NOT_FOUND);
    }

    return this.createStudentData(requestedBy, student);
  }

  async create(requestedBy: TokenUser, dto: StudentCreateDto) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.students,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const students = await prisma.student.findMany({
      where: {
        email: dto.email,
      },
    });

    if (students.length) {
      throw new CustomError(
        HTTP_EXCEPTIONS.USER_WITH_THAT_EMAIL_ALREADY_EXISTS
      );
    }

    // Verify parent exists if parentId is provided
    if (dto.parentId) {
      const parent = await prisma.parent.findUnique({
        where: { id: dto.parentId, branchId: requestedBy.activeBranchId },
        select: { id: true },
      });

      if (!parent) {
        throw new CustomError(HTTP_EXCEPTIONS.PARENT_NOT_FOUND);
      }
    }

    // const hashedPassword = await hash(dto.password, 10);
    const encryptedNationalId = dto.nationalId
      ? encrypt(dto.nationalId)
      : undefined;

    const id = crypto.randomUUID();

    const tokenData = {
      id,
      email: dto.email,
      userType: 'student',
      branchId: requestedBy.activeBranchId,
    };

    const token = generateToken(tokenData, INVITATION_EXPIRATION_TIME);
    const hashedToken = await hash(token, 10);

    if (dto.profilePictureUrl) {
      dto.profilePictureUrl = id;
    }

    const student = await prisma.student.create({
      data: {
        ...dto,
        id,
        password: crypto.randomUUID(),
        nationalId: encryptedNationalId,
        parentId: dto.parentId!,
        branchId: requestedBy.activeBranchId,
        tokens: {
          create: {
            type: 'INVITATION',
            token: hashedToken,
          },
        },
      },
      include: { ...studentInclude, tokens: true },
    });

    await emailService.sendInvitationMail(
      {
        email: student.email,
        userType: 'student',
      },
      token
    );

    const { tokens: _, ...studentWithoutTokens } = student;

    const studentData = await this.createStudentData(
      requestedBy,
      studentWithoutTokens
    );

    if (dto.profilePictureUrl) {
      const signedAwsS3Url = await this.createSignedAwsS3Url(
        requestedBy,
        'putObject',
        id
      );

      return {
        ...studentData,
        signedAwsS3Url,
      };
    }

    return studentData;
  }

  async createFromExcel(requestedBy: TokenUser, file: File) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.students,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    if (!file) {
      throw new CustomError(HTTP_EXCEPTIONS.NOT_FOUND);
    }

    const branch = await prisma.branch.findUnique({
      where: {
        id: requestedBy.activeBranchId,
      },
      select: {
        maximumStudents: true,
        _count: {
          select: {
            students: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
        students: {
          select: {
            email: true,
            nationalId: true,
          },
        },
      },
    });

    if (!branch) {
      throw new CustomError(HTTP_EXCEPTIONS.BRANCH_NOT_FOUND);
    }

    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);

    const studentsSheet = workbook.getWorksheet(1);

    const studentsToCreate: Prisma.StudentCreateManyInput[] = [];
    const failedStudents: {
      row: number;
      firstName: string;
      lastName: string;
      email: string;
      reason: 'corruptedData' | 'duplicate';
      failedFields: string[];
    }[] = [];

    const date = new Date();

    studentsSheet?.eachRow((row, index) => {
      // skip header
      if (index === 1) {
        return;
      }

      const firstName =
        String(row.getCell(1).value || '')
          .trim()
          .toLowerCase() || null;
      const lastName =
        String(row.getCell(2).value || '')
          .trim()
          .toLowerCase() || null;
      const emailRaw = row.getCell(3).value as string | { text: string };
      const email =
        typeof emailRaw === 'string'
          ? String(emailRaw).trim().toLowerCase() || null
          : emailRaw.text.trim().toLowerCase() || null;
      const nationalId = String(row.getCell(4).value || '').trim() || null;
      const gender =
        String(row.getCell(5).value || '')
          .trim()
          .toUpperCase() || null;
      const dateOfBirth = String(row.getCell(6).value || '').trim() || null;
      const phoneNumber = String(row.getCell(7).value || '').trim() || null;
      const country =
        String(row.getCell(8).value || '')
          .trim()
          .toLowerCase() || null;
      const city =
        String(row.getCell(9).value || '')
          .trim()
          .toLowerCase() || null;
      const state =
        String(row.getCell(10).value || '')
          .trim()
          .toLowerCase() || undefined;
      const address = String(row.getCell(11).value || '').trim() || null;
      const zipCode = String(row.getCell(12).value || '').trim() || null;
      const about = String(row.getCell(13).value || '').trim() || undefined;
      const facebookLink =
        String(row.getCell(14).value || '').trim() || undefined;
      const twitterLink =
        String(row.getCell(15).value || '').trim() || undefined;
      const instagramLink =
        String(row.getCell(16).value || '').trim() || undefined;
      const linkedinLink =
        String(row.getCell(17).value || '').trim() || undefined;

      const student = {
        firstName,
        lastName,
        email,
        nationalId,
        gender,
        dateOfBirth,
        phoneNumber,
        country,
        city,
        state,
        address,
        zipCode,
        about,
        facebookLink,
        twitterLink,
        instagramLink,
        linkedinLink,
      };

      const safeParseResult = studentCreateFromExcelSchema.safeParse(student);

      if (!safeParseResult.success) {
        failedStudents.push({
          row: index,
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          reason: 'corruptedData',
          failedFields: safeParseResult.error.issues.map((issue) => {
            return issue.path.join(',');
          }),
        });
        return;
      }

      const maybeStudent = branch!.students.find(
        (student) => student.email === email
      );

      if (maybeStudent) {
        const failedFields = ['nationalId', 'email'].filter(
          (field) =>
            maybeStudent[field as keyof typeof maybeStudent] ===
            student[field as keyof typeof student]
        );

        failedStudents.push({
          row: index,
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          reason: 'duplicate',
          failedFields,
        });

        return;
      }

      const createdDate = date;
      createdDate.setSeconds(date.getSeconds() + index + 1);

      studentsToCreate.push({
        id: crypto.randomUUID(),
        branchId: requestedBy.activeBranchId,
        ...safeParseResult.data,
        password: crypto.randomUUID(),
        createdAt: createdDate,
        updatedAt: createdDate,
      });
    });

    const createdStudents = await prisma.student.createManyAndReturn({
      data: studentsToCreate,
    });

    const limit = pLimit(10);

    await Promise.all(
      createdStudents.map(async (student) => {
        await limit(async () => {
          const token = generateToken(
            {
              id: student.id,
              email: student.email,
              userType: 'student',
              branchId: requestedBy.activeBranchId,
            },
            INVITATION_EXPIRATION_TIME
          );

          const hashedToken = await hash(token, 10);

          await prisma.token.create({
            data: {
              studentId: student.id,
              token: hashedToken,
              type: 'INVITATION',
            },
          });

          await emailService.sendInvitationMail(
            {
              email: student.email,
              userType: 'student',
            },
            token
          );
        });
      })
    );

    return {
      successCount: createdStudents.length,
      failedCount: failedStudents.length,
      failedStudents,
    };
  }

  async update(requestedBy: TokenUser, dto: StudentUpdateDto) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.students,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const student = await prisma.student.findUnique({
      where: {
        id: dto.id,
        branchId: requestedBy.activeBranchId,
      },
      select: { id: true },
    });

    if (!student) {
      throw new CustomError(HTTP_EXCEPTIONS.STUDENT_NOT_FOUND);
    }

    // Verify parent exists if parentId is provided
    if (dto.parentId) {
      const parent = await prisma.parent.findUnique({
        where: { id: dto.parentId, branchId: requestedBy.activeBranchId },
        select: { id: true },
      });

      if (!parent) {
        throw new CustomError(HTTP_EXCEPTIONS.PARENT_NOT_FOUND);
      }
    }

    if (dto.password) {
      dto.password = await hash(dto.password, 10);
    }

    if (dto.nationalId) {
      dto.nationalId = encrypt(dto.nationalId);
    }

    if (dto.profilePictureUrl) {
      dto.profilePictureUrl = dto.id;
    }

    const updatedStudent = await prisma.student.update({
      where: { id: dto.id },
      data: {
        ...dto,
        statusUpdatedAt: dto.status ? new Date() : undefined,
        statusUpdatedBy: dto.status ? requestedBy.id : undefined,
      },
      include: studentInclude,
    });

    const studentData = await this.createStudentData(
      requestedBy,
      updatedStudent
    );

    if (dto.profilePictureUrl) {
      const signedAwsS3Url = await this.createSignedAwsS3Url(
        requestedBy,
        'putObject',
        dto.id
      );

      return {
        ...studentData,
        signedAwsS3Url,
      };
    }

    return studentData;
  }

  async delete(requestedBy: TokenUser, id: string) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.students,
      PERMISSIONS.delete
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const payload = await prisma.student.updateMany({
      where: {
        id,
        branchId: requestedBy.activeBranchId,
      },
      data: {
        deletedAt: new Date(),
        deletedBy: requestedBy.id,
      },
    });

    if (payload.count === 0) {
      throw new CustomError(HTTP_EXCEPTIONS.STUDENT_NOT_FOUND);
    }

    return id;
  }

  async updateSignupStatus(
    requestedBy: TokenUser,
    dto: StudentUpdateSignupStatusDto
  ) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.students,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const date = new Date();
    const student = await prisma.student.update({
      where: { id: dto.id, branchId: requestedBy.activeBranchId },
      data: {
        signUpApprovedAt: dto.status === 'ACTIVE' ? date : undefined,
        signUpApprovedBy: dto.status === 'ACTIVE' ? requestedBy.id : undefined,
        status: dto.status,
        statusUpdatedAt: date,
        statusUpdatedBy: requestedBy.id,
        statusUpdateReason: dto.statusUpdateReason,
      },
      include: studentInclude,
    });

    const token = generateToken(
      {
        id: student.id,
        email: student.email,
        userType: 'student',
        branchId: requestedBy.activeBranchId,
      },
      INVITATION_EXPIRATION_TIME
    );
    const hashedToken = await hash(token, 10);

    if (dto.status === 'REQUESTED_CHANGES') {
      await prisma.$transaction(
        async (tx) => {
          await tx.token.deleteMany({
            where: {
              email: student.email,
              type: 'INVITATION',
              isUsed: false,
            },
          });

          // create token to allow user to complete signup
          await tx.token.create({
            data: {
              studentId: student.id,
              token: hashedToken,
              type: 'INVITATION',
            },
          });
        },
        { timeout: 30000 }
      );
    }

    await emailService.sendSignupStatusUpdateEmail(student.email, dto, token);

    return this.createStudentData(requestedBy, student);
  }

  async updateSuspended(
    requestedBy: TokenUser,
    dto: StudentUpdateSuspendedDto
  ) {
    const userHasPermission = hasPermission(
      requestedBy,
      MODULE_CODES.students,
      PERMISSIONS.write
    );

    if (!userHasPermission) {
      throw new CustomError(HTTP_EXCEPTIONS.UNAUTHORIZED);
    }

    const student = await prisma.student.update({
      where: { id: dto.id, branchId: requestedBy.activeBranchId },
      data: dto,
      include: studentInclude,
    });

    return this.createStudentData(requestedBy, student);
  }

  async createStudentData<T extends Student>(
    requestedBy: TokenUser,
    student: T
  ) {
    const { password: _, ...studentWithoutPassword } = student;

    studentWithoutPassword.nationalId = studentWithoutPassword.nationalId
      ? decrypt(studentWithoutPassword.nationalId)
      : null;

    if (studentWithoutPassword.profilePictureUrl) {
      const url = await this.createSignedAwsS3Url(
        requestedBy,
        'getObject',
        studentWithoutPassword.profilePictureUrl
      );
      studentWithoutPassword.profilePictureUrl = url;
    }

    return studentWithoutPassword;
  }

  private async createSignedAwsS3Url(
    requestedBy: TokenUser,
    operation: 'getObject' | 'putObject',
    url: string
  ) {
    return generateSignedUrl(
      operation,
      requestedBy.companyId!,
      requestedBy.activeBranchId,
      'profile-pictures',
      url
    );
  }
}
