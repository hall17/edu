-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ACTIVE', 'RETURNED', 'PENDING_RETURN', 'LOST', 'DAMAGED');

-- CreateEnum
CREATE TYPE "AttendanceNotificationType" AS ENUM ('ATTENDANCE_VIOLATION', 'REMINDER', 'WEEKLY_SUMMARY', 'MONTHLY_SUMMARY');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'PARTIAL', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "BranchStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ClassroomIntegrationStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ClassroomStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "ClassroomTemplateStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "CurriculumStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "DeviceCondition" AS ENUM ('NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DAMAGED');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('AVAILABLE', 'ASSIGNED', 'IN_REPAIR', 'RETIRED', 'LOST', 'STOLEN');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('LAPTOP', 'DESKTOP', 'TABLET', 'SMARTPHONE', 'MONITOR', 'KEYBOARD', 'MOUSE', 'HEADSET', 'WEBCAM', 'PRINTER', 'OTHER');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ENROLLED', 'WITHDRAWN', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'TR', 'DE', 'ES', 'FR', 'IT', 'PT', 'RU', 'ZH', 'JA');

-- CreateEnum
CREATE TYPE "ModuleStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');

-- CreateEnum
CREATE TYPE "RoleStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'INVITED', 'REQUESTED_APPROVAL', 'REQUESTED_CHANGES', 'REJECTED');

-- CreateEnum
CREATE TYPE "SubjectStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('RESET_PASSWORD', 'INVITATION', 'OTP');

-- CreateEnum
CREATE TYPE "UserActivity" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'PASSWORD_CHANGE', 'PROFILE_UPDATE', 'PREFERENCES_UPDATE', 'FAILED_LOGIN_ATTEMPT', 'ACCOUNT_LOCKOUT', 'ACCOUNT_REACTIVATION');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'INVITED');

-- CreateEnum
CREATE TYPE "WidgetStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('FLEXIBLE', 'STRICT');

-- CreateEnum
CREATE TYPE "ScoringType" AS ENUM ('MANUAL', 'AUTOMATIC');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'MATCHING', 'FILL_IN_BLANK', 'ORDERING', 'ESSAY');

-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "StudentClassroomIntegrationAssessmentSessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'AUTO_SUBMITTED', 'LATE_SUBMISSION');

-- CreateEnum
CREATE TYPE "StudentClassroomIntegrationAssessmentStatus" AS ENUM ('ELIGIBLE', 'COMPLETED', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "AssessmentLogAction" AS ENUM ('CREATED', 'UPDATED', 'DELETED', 'RESTORED');

-- CreateEnum
CREATE TYPE "AssessmentNotificationType" AS ENUM ('REMINDER', 'SUBMISSION_CONFIRMATION');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'ACKNOWLEDGED', 'FAILED');

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "status" "CompanyStatus" NOT NULL DEFAULT 'ACTIVE',
    "logoUrl" VARCHAR(255),
    "statusUpdateReason" VARCHAR(500),
    "statusUpdatedAt" TIMESTAMP(3),
    "statusUpdatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "version" TEXT DEFAULT '1.0.0',
    "status" "ModuleStatus" NOT NULL DEFAULT 'ACTIVE',
    "canBeDeleted" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "nationalId" VARCHAR(250),
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "gender" "Gender",
    "dateOfBirth" DATE,
    "profilePictureUrl" VARCHAR(255),
    "phoneCountryCode" VARCHAR(5) DEFAULT '90',
    "phoneNumber" VARCHAR(15),
    "countryCode" VARCHAR(2) DEFAULT 'TR',
    "city" VARCHAR(50),
    "state" VARCHAR(50),
    "address" VARCHAR(255),
    "zipCode" VARCHAR(10),
    "about" VARCHAR(255),
    "facebookLink" VARCHAR(255),
    "twitterLink" VARCHAR(255),
    "instagramLink" VARCHAR(255),
    "linkedinLink" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "statusUpdatedAt" TIMESTAMP(3),
    "statusUpdatedBy" TEXT,
    "statusUpdateReason" VARCHAR(500),
    "titleId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Title" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Title_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "branchId" INTEGER NOT NULL,
    "parentId" TEXT,
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "gender" "Gender",
    "dateOfBirth" DATE,
    "nationalId" VARCHAR(250),
    "profilePictureUrl" VARCHAR(255),
    "phoneCountryCode" VARCHAR(5) DEFAULT '90',
    "phoneNumber" VARCHAR(15),
    "countryCode" VARCHAR(2) DEFAULT 'TR',
    "state" VARCHAR(50),
    "city" VARCHAR(50),
    "address" VARCHAR(255),
    "zipCode" VARCHAR(10),
    "about" VARCHAR(255),
    "facebookLink" VARCHAR(255),
    "twitterLink" VARCHAR(255),
    "instagramLink" VARCHAR(255),
    "linkedinLink" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "statusUpdateReason" VARCHAR(500),
    "statusUpdatedAt" TIMESTAMP(3),
    "statusUpdatedBy" TEXT,
    "signUpApprovedAt" TIMESTAMP(3),
    "signUpApprovedBy" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" TEXT NOT NULL,
    "branchId" INTEGER NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "nationalId" VARCHAR(250),
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "gender" "Gender",
    "dateOfBirth" DATE,
    "profilePictureUrl" VARCHAR(255),
    "phoneCountryCode" VARCHAR(5) DEFAULT '90',
    "phoneNumber" VARCHAR(15),
    "countryCode" VARCHAR(2) DEFAULT 'TR',
    "city" VARCHAR(50),
    "state" VARCHAR(50),
    "address" VARCHAR(255),
    "zipCode" VARCHAR(10),
    "about" VARCHAR(255),
    "facebookLink" VARCHAR(255),
    "twitterLink" VARCHAR(255),
    "instagramLink" VARCHAR(255),
    "linkedinLink" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "statusUpdateReason" VARCHAR(500),
    "statusUpdatedAt" TIMESTAMP(3),
    "statusUpdatedBy" TEXT,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "status" "WidgetStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "status" "BranchStatus" NOT NULL DEFAULT 'ACTIVE',
    "name" VARCHAR(50) NOT NULL,
    "logoUrl" VARCHAR(255),
    "location" VARCHAR(255),
    "contact" VARCHAR(255),
    "canBeDeleted" BOOLEAN NOT NULL DEFAULT true,
    "maximumStudents" INTEGER NOT NULL DEFAULT 250,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "statusUpdateReason" VARCHAR(500),
    "statusUpdatedAt" TIMESTAMP(3),
    "statusUpdatedBy" TEXT,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "status" "RoleStatus" NOT NULL DEFAULT 'ACTIVE',
    "code" TEXT,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "statusUpdateReason" VARCHAR(500),
    "statusUpdatedAt" TIMESTAMP(3),
    "statusUpdatedBy" TEXT,
    "branchId" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "status" "ClassroomStatus" NOT NULL DEFAULT 'ACTIVE',
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "capacity" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "attendancePassPercentage" INTEGER NOT NULL DEFAULT 80,
    "assessmentScorePass" INTEGER NOT NULL DEFAULT 80,
    "assignmentScorePass" INTEGER NOT NULL DEFAULT 80,
    "sendNotifications" BOOLEAN NOT NULL DEFAULT true,
    "attendanceThreshold" INTEGER,
    "reminderFrequency" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "statusUpdateReason" VARCHAR(500),
    "statusUpdatedAt" TIMESTAMP(3),
    "statusUpdatedBy" TEXT,
    "branchId" INTEGER NOT NULL,
    "classroomTemplateId" TEXT,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomTemplate" (
    "id" TEXT NOT NULL,
    "status" "ClassroomTemplateStatus" NOT NULL DEFAULT 'ACTIVE',
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "capacity" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "attendancePassPercentage" INTEGER NOT NULL DEFAULT 80,
    "assessmentScorePass" INTEGER NOT NULL DEFAULT 80,
    "assignmentScorePass" INTEGER NOT NULL DEFAULT 80,
    "sendNotifications" BOOLEAN NOT NULL DEFAULT true,
    "attendanceThreshold" INTEGER,
    "reminderFrequency" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "statusUpdateReason" VARCHAR(500),
    "statusUpdatedAt" TIMESTAMP(3),
    "statusUpdatedBy" TEXT,
    "branchId" INTEGER NOT NULL,

    CONSTRAINT "ClassroomTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomTemplateModule" (
    "classroomTemplateId" TEXT NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassroomTemplateModule_pkey" PRIMARY KEY ("classroomTemplateId","moduleId")
);

-- CreateTable
CREATE TABLE "ClassroomAnnouncement" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassroomAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomStudent" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ENROLLED',

    CONSTRAINT "ClassroomStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomIntegrationSchedule" (
    "id" TEXT NOT NULL,
    "classroomIntegrationId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "ClassroomIntegrationSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomIntegrationSession" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "classroomIntegrationId" TEXT NOT NULL,
    "teacherId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isAttendanceRecordCompleted" BOOLEAN NOT NULL DEFAULT false,
    "accessLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "attendanceRecordCompletedAt" TIMESTAMP(3),
    "attendanceRecordCompletedBy" TEXT,

    CONSTRAINT "ClassroomIntegrationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomIntegrationSessionLesson" (
    "classroomIntegrationSessionId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ClassroomModule" (
    "classroomId" TEXT NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassroomModule_pkey" PRIMARY KEY ("classroomId","moduleId")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500),
    "status" "SubjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "statusUpdateReason" VARCHAR(500),
    "statusUpdatedAt" TIMESTAMP(3),
    "statusUpdatedBy" TEXT,
    "branchId" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectTeacher" (
    "subjectId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "SubjectTeacher_pkey" PRIMARY KEY ("subjectId","teacherId")
);

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "status" "CurriculumStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "statusUpdateReason" VARCHAR(500),
    "statusUpdatedAt" TIMESTAMP(3),
    "statusUpdatedBy" TEXT,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomIntegration" (
    "id" TEXT NOT NULL,
    "status" "ClassroomIntegrationStatus" NOT NULL DEFAULT 'ACTIVE',
    "classroomId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "curriculumId" TEXT NOT NULL,
    "teacherId" TEXT,
    "accessLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "ClassroomIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "curriculumId" TEXT NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "expiresAt" TIMESTAMP(3),
    "userId" TEXT,
    "studentId" TEXT,
    "parentId" TEXT,
    "email" TEXT,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "serialNumber" VARCHAR(100) NOT NULL,
    "assetTag" VARCHAR(50),
    "deviceType" "DeviceType" NOT NULL,
    "brand" VARCHAR(50) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "specifications" VARCHAR(500),
    "purchaseDate" DATE,
    "warrantyExpiry" DATE,
    "purchasePrice" DECIMAL(10,2),
    "purchaseCurrency" VARCHAR(10),
    "supplier" VARCHAR(100),
    "location" VARCHAR(100),
    "status" "DeviceStatus" NOT NULL DEFAULT 'AVAILABLE',
    "condition" "DeviceCondition" NOT NULL DEFAULT 'NEW',
    "notes" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "branchId" INTEGER NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDevice" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP(3),
    "expectedReturnAt" TIMESTAMP(3),
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "assignmentNotes" VARCHAR(500),
    "returnNotes" VARCHAR(500),
    "conditionAtAssignment" "DeviceCondition",
    "conditionAtReturn" "DeviceCondition",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchModule" (
    "branchId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "status" "ModuleStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "BranchModule_pkey" PRIMARY KEY ("branchId","moduleId")
);

-- CreateTable
CREATE TABLE "BranchUser" (
    "branchId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BranchUser_pkey" PRIMARY KEY ("branchId","userId")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "moduleId" INTEGER,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "UserWidget" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "widgetId" INTEGER NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "visibility" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWidget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "ModuleRequiredModule" (
    "moduleId" INTEGER NOT NULL,
    "requiredModuleId" INTEGER NOT NULL,
    "minRequiredVersion" VARCHAR(20),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleRequiredModule_pkey" PRIMARY KEY ("moduleId","requiredModuleId")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'EN',
    "theme" "Theme" NOT NULL DEFAULT 'LIGHT',
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "UserActivity" NOT NULL,
    "ipAddress" TEXT,
    "deviceInfo" TEXT,
    "location" TEXT,
    "browserInfo" TEXT,
    "osInfo" TEXT,
    "deviceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "studentId" TEXT,
    "parentId" TEXT,
    "success" BOOLEAN NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "location" TEXT,
    "deviceInfo" TEXT,
    "browserInfo" TEXT,
    "osInfo" TEXT,
    "deviceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentPreference" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'EN',
    "theme" "Theme" NOT NULL DEFAULT 'LIGHT',
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentActivityLog" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "action" "UserActivity" NOT NULL,
    "ipAddress" TEXT,
    "deviceInfo" TEXT,
    "location" TEXT,
    "browserInfo" TEXT,
    "osInfo" TEXT,
    "deviceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentPreference" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'EN',
    "theme" "Theme" NOT NULL DEFAULT 'LIGHT',
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classroomIntegrationSessionId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "remarks" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceSummary" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalPresent" INTEGER NOT NULL DEFAULT 0,
    "totalAbsent" INTEGER NOT NULL DEFAULT 0,
    "totalPartial" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "classroomIntegrationId" TEXT NOT NULL,

    CONSTRAINT "AttendanceSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceNotification" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classroomIntegrationId" TEXT NOT NULL,
    "notificationType" "AttendanceNotificationType" NOT NULL,
    "notificationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "acknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "difficulty" "QuestionDifficulty" NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "subjectId" TEXT NOT NULL,
    "curriculumId" TEXT,
    "lessonId" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "scheduleType" "ScheduleType" NOT NULL DEFAULT 'FLEXIBLE',
    "duration" INTEGER,
    "maxPoints" INTEGER NOT NULL DEFAULT 100,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "scoringType" "ScoringType" NOT NULL DEFAULT 'MANUAL',
    "coverImageUrl" VARCHAR(500),
    "sendNotifications" BOOLEAN NOT NULL DEFAULT false,
    "notificationFrequency" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "deletedBy" TEXT,
    "statusUpdatedAt" TIMESTAMP(3),
    "statusUpdatedBy" TEXT,
    "statusUpdateReason" VARCHAR(500),
    "subjectId" TEXT NOT NULL,
    "curriculumId" TEXT,
    "lessonId" TEXT,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomIntegrationAssessment" (
    "id" TEXT NOT NULL,
    "classroomIntegrationId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassroomIntegrationAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentClassroomIntegrationAssessment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classroomIntegrationAssessmentId" TEXT NOT NULL,
    "status" "StudentClassroomIntegrationAssessmentStatus" NOT NULL DEFAULT 'ELIGIBLE',
    "pointsEarned" INTEGER,
    "evaluatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "evaluatedBy" TEXT,

    CONSTRAINT "StudentClassroomIntegrationAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentClassroomIntegrationAssessmentSession" (
    "id" TEXT NOT NULL,
    "studentClassroomIntegrationAssessmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "status" "StudentClassroomIntegrationAssessmentSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "submissionStatus" "SubmissionStatus",
    "isStandalone" BOOLEAN NOT NULL DEFAULT false,
    "feedbackText" TEXT,
    "feedbackRating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentClassroomIntegrationAssessmentSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentQuestion" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "AssessmentQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionResponse" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "responseData" JSONB NOT NULL,
    "isCorrect" BOOLEAN,
    "pointsEarned" INTEGER,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentLog" (
    "id" TEXT NOT NULL,
    "action" "AssessmentLogAction" NOT NULL,
    "notes" TEXT,
    "assessmentId" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentGradingRubric" (
    "id" TEXT NOT NULL,
    "criterion" VARCHAR(200) NOT NULL,
    "minPoints" INTEGER NOT NULL,
    "maxPoints" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assessmentId" TEXT NOT NULL,

    CONSTRAINT "AssessmentGradingRubric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentNotification" (
    "id" TEXT NOT NULL,
    "type" "AssessmentNotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "branchId" INTEGER,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "AssessmentNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Module_code_key" ON "Module"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_nationalId_key" ON "User"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_nationalId_key" ON "Student"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_nationalId_key" ON "Parent"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_slug_key" ON "Branch"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Role_branchId_name_key" ON "Role"("branchId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_branchId_name_key" ON "Classroom"("branchId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomTemplate_branchId_name_key" ON "ClassroomTemplate"("branchId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomTemplateModule_classroomTemplateId_moduleId_key" ON "ClassroomTemplateModule"("classroomTemplateId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomAnnouncement_classroomId_title_key" ON "ClassroomAnnouncement"("classroomId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomStudent_classroomId_studentId_key" ON "ClassroomStudent"("classroomId", "studentId");

-- CreateIndex
CREATE INDEX "ClassroomIntegrationSchedule_classroomIntegrationId_dayOfWe_idx" ON "ClassroomIntegrationSchedule"("classroomIntegrationId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomIntegrationSchedule_classroomIntegrationId_dayOfWe_key" ON "ClassroomIntegrationSchedule"("classroomIntegrationId", "dayOfWeek", "startTime");

-- CreateIndex
CREATE INDEX "ClassroomIntegrationSession_classroomIntegrationId_idx" ON "ClassroomIntegrationSession"("classroomIntegrationId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomIntegrationSession_classroomIntegrationId_startDat_key" ON "ClassroomIntegrationSession"("classroomIntegrationId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "ClassroomIntegrationSessionLesson_classroomIntegrationSessi_idx" ON "ClassroomIntegrationSessionLesson"("classroomIntegrationSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomIntegrationSessionLesson_classroomIntegrationSessi_key" ON "ClassroomIntegrationSessionLesson"("classroomIntegrationSessionId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomModule_classroomId_moduleId_key" ON "ClassroomModule"("classroomId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_branchId_name_key" ON "Subject"("branchId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectTeacher_subjectId_teacherId_key" ON "SubjectTeacher"("subjectId", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Curriculum_subjectId_name_key" ON "Curriculum"("subjectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomIntegration_classroomId_subjectId_key" ON "ClassroomIntegration"("classroomId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_curriculumId_name_key" ON "Lesson"("curriculumId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_curriculumId_name_order_key" ON "Lesson"("curriculumId", "name", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_moduleId_name_key" ON "Permission"("moduleId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Device_serialNumber_key" ON "Device"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Device_assetTag_key" ON "Device"("assetTag");

-- CreateIndex
CREATE INDEX "Device_serialNumber_idx" ON "Device"("serialNumber");

-- CreateIndex
CREATE INDEX "Device_assetTag_idx" ON "Device"("assetTag");

-- CreateIndex
CREATE INDEX "Device_deviceType_idx" ON "Device"("deviceType");

-- CreateIndex
CREATE INDEX "Device_status_idx" ON "Device"("status");

-- CreateIndex
CREATE INDEX "UserDevice_deviceId_idx" ON "UserDevice"("deviceId");

-- CreateIndex
CREATE INDEX "UserDevice_userId_idx" ON "UserDevice"("userId");

-- CreateIndex
CREATE INDEX "UserDevice_status_idx" ON "UserDevice"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BranchModule_branchId_moduleId_key" ON "BranchModule"("branchId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "BranchUser_branchId_userId_key" ON "BranchUser"("branchId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_moduleId_key" ON "UserRole"("userId", "roleId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWidget_userId_widgetId_key" ON "UserWidget"("userId", "widgetId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "ModuleRequiredModule_requiredModuleId_idx" ON "ModuleRequiredModule"("requiredModuleId");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleRequiredModule_moduleId_requiredModuleId_key" ON "ModuleRequiredModule"("moduleId", "requiredModuleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "UserActivityLog_userId_idx" ON "UserActivityLog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentPreference_studentId_key" ON "StudentPreference"("studentId");

-- CreateIndex
CREATE INDEX "StudentActivityLog_studentId_idx" ON "StudentActivityLog"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentPreference_parentId_key" ON "ParentPreference"("parentId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_studentId_idx" ON "AttendanceRecord"("studentId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_classroomIntegrationSessionId_idx" ON "AttendanceRecord"("classroomIntegrationSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_studentId_classroomIntegrationSessionId_key" ON "AttendanceRecord"("studentId", "classroomIntegrationSessionId");

-- CreateIndex
CREATE INDEX "AttendanceSummary_studentId_year_month_idx" ON "AttendanceSummary"("studentId", "year", "month");

-- CreateIndex
CREATE INDEX "AttendanceSummary_classroomIntegrationId_year_month_idx" ON "AttendanceSummary"("classroomIntegrationId", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceSummary_studentId_classroomIntegrationId_month_ye_key" ON "AttendanceSummary"("studentId", "classroomIntegrationId", "month", "year");

-- CreateIndex
CREATE INDEX "AttendanceNotification_studentId_status_idx" ON "AttendanceNotification"("studentId", "status");

-- CreateIndex
CREATE INDEX "AttendanceNotification_classroomIntegrationId_notificationD_idx" ON "AttendanceNotification"("classroomIntegrationId", "notificationDate");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceNotification_studentId_classroomIntegrationId_not_key" ON "AttendanceNotification"("studentId", "classroomIntegrationId", "notificationType");

-- CreateIndex
CREATE INDEX "Question_lessonId_idx" ON "Question"("lessonId");

-- CreateIndex
CREATE INDEX "Question_type_idx" ON "Question"("type");

-- CreateIndex
CREATE INDEX "ClassroomIntegrationAssessment_classroomIntegrationId_idx" ON "ClassroomIntegrationAssessment"("classroomIntegrationId");

-- CreateIndex
CREATE INDEX "ClassroomIntegrationAssessment_assessmentId_idx" ON "ClassroomIntegrationAssessment"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomIntegrationAssessment_classroomIntegrationId_asses_key" ON "ClassroomIntegrationAssessment"("classroomIntegrationId", "assessmentId");

-- CreateIndex
CREATE INDEX "StudentClassroomIntegrationAssessment_studentId_idx" ON "StudentClassroomIntegrationAssessment"("studentId");

-- CreateIndex
CREATE INDEX "StudentClassroomIntegrationAssessment_classroomIntegrationA_idx" ON "StudentClassroomIntegrationAssessment"("classroomIntegrationAssessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentClassroomIntegrationAssessment_studentId_classroomIn_key" ON "StudentClassroomIntegrationAssessment"("studentId", "classroomIntegrationAssessmentId");

-- CreateIndex
CREATE INDEX "StudentClassroomIntegrationAssessmentSession_studentId_idx" ON "StudentClassroomIntegrationAssessmentSession"("studentId");

-- CreateIndex
CREATE INDEX "StudentClassroomIntegrationAssessmentSession_studentClassro_idx" ON "StudentClassroomIntegrationAssessmentSession"("studentClassroomIntegrationAssessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentClassroomIntegrationAssessmentSession_studentId_stud_key" ON "StudentClassroomIntegrationAssessmentSession"("studentId", "studentClassroomIntegrationAssessmentId");

-- CreateIndex
CREATE INDEX "AssessmentQuestion_questionId_idx" ON "AssessmentQuestion"("questionId");

-- CreateIndex
CREATE INDEX "AssessmentQuestion_assessmentId_idx" ON "AssessmentQuestion"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentQuestion_questionId_assessmentId_key" ON "AssessmentQuestion"("questionId", "assessmentId");

-- CreateIndex
CREATE INDEX "QuestionResponse_sessionId_idx" ON "QuestionResponse"("sessionId");

-- CreateIndex
CREATE INDEX "QuestionResponse_studentId_idx" ON "QuestionResponse"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionResponse_questionId_sessionId_key" ON "QuestionResponse"("questionId", "sessionId");

-- CreateIndex
CREATE INDEX "AssessmentLog_assessmentId_idx" ON "AssessmentLog"("assessmentId");

-- CreateIndex
CREATE INDEX "AssessmentLog_performedBy_idx" ON "AssessmentLog"("performedBy");

-- CreateIndex
CREATE INDEX "AssessmentGradingRubric_assessmentId_idx" ON "AssessmentGradingRubric"("assessmentId");

-- CreateIndex
CREATE INDEX "AssessmentNotification_assessmentId_idx" ON "AssessmentNotification"("assessmentId");

-- CreateIndex
CREATE INDEX "AssessmentNotification_studentId_idx" ON "AssessmentNotification"("studentId");

-- CreateIndex
CREATE INDEX "AssessmentNotification_status_idx" ON "AssessmentNotification"("status");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_statusUpdatedBy_fkey" FOREIGN KEY ("statusUpdatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_statusUpdatedBy_fkey" FOREIGN KEY ("statusUpdatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_statusUpdatedBy_fkey" FOREIGN KEY ("statusUpdatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_statusUpdatedBy_fkey" FOREIGN KEY ("statusUpdatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_statusUpdatedBy_fkey" FOREIGN KEY ("statusUpdatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_statusUpdatedBy_fkey" FOREIGN KEY ("statusUpdatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_statusUpdatedBy_fkey" FOREIGN KEY ("statusUpdatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_classroomTemplateId_fkey" FOREIGN KEY ("classroomTemplateId") REFERENCES "ClassroomTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomTemplate" ADD CONSTRAINT "ClassroomTemplate_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomTemplate" ADD CONSTRAINT "ClassroomTemplate_statusUpdatedBy_fkey" FOREIGN KEY ("statusUpdatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomTemplate" ADD CONSTRAINT "ClassroomTemplate_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomTemplateModule" ADD CONSTRAINT "ClassroomTemplateModule_classroomTemplateId_fkey" FOREIGN KEY ("classroomTemplateId") REFERENCES "ClassroomTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomTemplateModule" ADD CONSTRAINT "ClassroomTemplateModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomAnnouncement" ADD CONSTRAINT "ClassroomAnnouncement_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomStudent" ADD CONSTRAINT "ClassroomStudent_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomStudent" ADD CONSTRAINT "ClassroomStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegrationSchedule" ADD CONSTRAINT "ClassroomIntegrationSchedule_classroomIntegrationId_fkey" FOREIGN KEY ("classroomIntegrationId") REFERENCES "ClassroomIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegrationSchedule" ADD CONSTRAINT "ClassroomIntegrationSchedule_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegrationSession" ADD CONSTRAINT "ClassroomIntegrationSession_classroomIntegrationId_fkey" FOREIGN KEY ("classroomIntegrationId") REFERENCES "ClassroomIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegrationSession" ADD CONSTRAINT "ClassroomIntegrationSession_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegrationSession" ADD CONSTRAINT "ClassroomIntegrationSession_attendanceRecordCompletedBy_fkey" FOREIGN KEY ("attendanceRecordCompletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegrationSession" ADD CONSTRAINT "ClassroomIntegrationSession_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegrationSessionLesson" ADD CONSTRAINT "ClassroomIntegrationSessionLesson_classroomIntegrationSess_fkey" FOREIGN KEY ("classroomIntegrationSessionId") REFERENCES "ClassroomIntegrationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegrationSessionLesson" ADD CONSTRAINT "ClassroomIntegrationSessionLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomModule" ADD CONSTRAINT "ClassroomModule_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomModule" ADD CONSTRAINT "ClassroomModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegration" ADD CONSTRAINT "ClassroomIntegration_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegration" ADD CONSTRAINT "ClassroomIntegration_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegration" ADD CONSTRAINT "ClassroomIntegration_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegration" ADD CONSTRAINT "ClassroomIntegration_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDevice" ADD CONSTRAINT "UserDevice_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDevice" ADD CONSTRAINT "UserDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchModule" ADD CONSTRAINT "BranchModule_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchModule" ADD CONSTRAINT "BranchModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchModule" ADD CONSTRAINT "BranchModule_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchUser" ADD CONSTRAINT "BranchUser_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchUser" ADD CONSTRAINT "BranchUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWidget" ADD CONSTRAINT "UserWidget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWidget" ADD CONSTRAINT "UserWidget_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleRequiredModule" ADD CONSTRAINT "ModuleRequiredModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleRequiredModule" ADD CONSTRAINT "ModuleRequiredModule_requiredModuleId_fkey" FOREIGN KEY ("requiredModuleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityLog" ADD CONSTRAINT "UserActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPreference" ADD CONSTRAINT "StudentPreference_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActivityLog" ADD CONSTRAINT "StudentActivityLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentPreference" ADD CONSTRAINT "ParentPreference_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_classroomIntegrationSessionId_fkey" FOREIGN KEY ("classroomIntegrationSessionId") REFERENCES "ClassroomIntegrationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSummary" ADD CONSTRAINT "AttendanceSummary_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSummary" ADD CONSTRAINT "AttendanceSummary_classroomIntegrationId_fkey" FOREIGN KEY ("classroomIntegrationId") REFERENCES "ClassroomIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceNotification" ADD CONSTRAINT "AttendanceNotification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceNotification" ADD CONSTRAINT "AttendanceNotification_classroomIntegrationId_fkey" FOREIGN KEY ("classroomIntegrationId") REFERENCES "ClassroomIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_statusUpdatedBy_fkey" FOREIGN KEY ("statusUpdatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegrationAssessment" ADD CONSTRAINT "ClassroomIntegrationAssessment_classroomIntegrationId_fkey" FOREIGN KEY ("classroomIntegrationId") REFERENCES "ClassroomIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomIntegrationAssessment" ADD CONSTRAINT "ClassroomIntegrationAssessment_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClassroomIntegrationAssessment" ADD CONSTRAINT "StudentClassroomIntegrationAssessment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClassroomIntegrationAssessment" ADD CONSTRAINT "StudentClassroomIntegrationAssessment_classroomIntegration_fkey" FOREIGN KEY ("classroomIntegrationAssessmentId") REFERENCES "ClassroomIntegrationAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClassroomIntegrationAssessment" ADD CONSTRAINT "StudentClassroomIntegrationAssessment_evaluatedBy_fkey" FOREIGN KEY ("evaluatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClassroomIntegrationAssessmentSession" ADD CONSTRAINT "StudentClassroomIntegrationAssessmentSession_studentClassr_fkey" FOREIGN KEY ("studentClassroomIntegrationAssessmentId") REFERENCES "StudentClassroomIntegrationAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentClassroomIntegrationAssessmentSession" ADD CONSTRAINT "StudentClassroomIntegrationAssessmentSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudentClassroomIntegrationAssessmentSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentLog" ADD CONSTRAINT "AssessmentLog_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentLog" ADD CONSTRAINT "AssessmentLog_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentGradingRubric" ADD CONSTRAINT "AssessmentGradingRubric_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentNotification" ADD CONSTRAINT "AssessmentNotification_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentNotification" ADD CONSTRAINT "AssessmentNotification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentNotification" ADD CONSTRAINT "AssessmentNotification_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentNotification" ADD CONSTRAINT "AssessmentNotification_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
