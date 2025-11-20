import { HttpStatus } from '../enums';
import { CustomErrorType } from '../types';

export const HTTP_EXCEPTIONS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Data Not found',
      tr: 'Veri bulunamadı',
    },
  },
  UNAUTHORIZED: {
    status: HttpStatus.UNAUTHORIZED,
    message: {
      en: 'Unauthorized',
      tr: 'Yetkisiz erişim',
    },
  },
  ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Data already exists',
      tr: 'Veri zaten mevcut',
    },
  },
  AUTHENTICATION_MISSING: {
    status: HttpStatus.UNAUTHORIZED,
    message: {
      en: 'Authentication missing',
      tr: 'Kimlik doğrulama eksik',
    },
  },
  AUTHENTICATION_FAILED: {
    status: HttpStatus.UNAUTHORIZED,
    message: {
      en: 'Authentication failed',
      tr: 'Kimlik doğrulama başarısız',
    },
  },
  AUTHORIZATION_MISSING: {
    status: HttpStatus.UNAUTHORIZED,
    message: {
      en: 'Authorization missing',
      tr: 'Yetkilendirme eksik',
    },
  },
  ACCOUNT_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Sorry, we could not find your account.',
      tr: 'Üzgünüz, hesabınız bulunamadı.',
    },
  },
  STUDENT_NOT_APPROVED_YET: {
    status: HttpStatus.UNAUTHORIZED,
    message: {
      en: 'Your account is not approved yet. Please contact the authorized person.',
      tr: 'Hesabınız henüz onaylanmamış. Lütfen yetkili kişi ile iletişime geçiniz.',
    },
  },
  STUDENT_REJECTED: {
    status: HttpStatus.UNAUTHORIZED,
    message: {
      en: 'Your account is rejected. Please contact the authorized person.',
      tr: 'Hesabınız reddedildi. Lütfen yetkili kişi ile iletişime geçiniz.',
    },
  },
  ACCOUNT_SUSPENDED: {
    status: HttpStatus.UNAUTHORIZED,
    message: {
      en: 'Your account is suspended. Please contact the authorized person.',
      tr: 'Hesabınız askıya alındı. Lütfen yetkili kişi ile iletişime geçiniz.',
    },
  },
  ACCOUNT_INVITATION_NOT_COMPLETED: {
    status: HttpStatus.UNAUTHORIZED,
    message: {
      en: 'Your account is invited but registration is not completed. Please complete your signup.',
      tr: 'Hesabınız davet edildi ama kayıt işlemi tamamlamadı. Lütfen kayıt işlemini tamamlayınız.',
    },
  },
  WRONG_PASSWORD: {
    status: HttpStatus.UNAUTHORIZED,
    message: {
      en: 'Wrong password',
      tr: 'Şifre yanlış',
    },
  },
  SAME_PASSWORD: {
    status: HttpStatus.UNAUTHORIZED,
    message: {
      en: 'New password cannot be the same as the old password',
      tr: 'Yeni şifre eski şifre ile aynı olamaz',
    },
  },
  USER_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'User not found',
      tr: 'Kullanıcı bulunamadı',
    },
  },
  PARENT_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Parent not found',
      tr: 'Aile üyesi bulunamadı',
    },
  },
  STUDENT_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Student not found',
      tr: 'Öğrenci bulunamadı',
    },
  },
  TEACHER_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Teacher not found',
      tr: 'Öğretmen bulunamadı',
    },
  },
  TOKEN_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Token not found',
      tr: 'Token bulunamadı',
    },
  },
  RESET_PASSWORD_TOKEN_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Reset password token not found',
      tr: 'Şifre sıfırlama tokeni bulunamadı',
    },
  },
  ACCOUNT_WITH_THAT_EMAIL_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Account with that email already exists',
      tr: 'Bu email ile kayıtlı hesap zaten mevcut',
    },
  },
  USER_WITH_THAT_EMAIL_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'User with that email already exists',
      tr: 'Bu email ile kayıtlı kullanıcı zaten mevcut',
    },
  },
  STUDENT_WITH_THAT_EMAIL_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Student with that email already exists',
      tr: 'Bu email ile kayıtlı öğrenci zaten mevcut',
    },
  },
  PARENT_WITH_THAT_EMAIL_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Parent with that email already exists',
      tr: 'Bu email ile kayıtlı veli zaten mevcut',
    },
  },
  FAILED_TO_SEND_EMAIL: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: {
      en: 'Failed to send email',
      tr: 'Email gönderimi başarısız',
    },
  },
  FAILED_TO_SEND_SMS: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: {
      en: 'Failed to send SMS',
      tr: 'SMS gönderimi başarısız',
    },
  },
  INVALID_PASSWORD: {
    status: HttpStatus.BAD_REQUEST,
    message: {
      en: 'Invalid password',
      tr: 'Geçersiz şifre',
    },
  },
  BAD_REQUEST: {
    status: HttpStatus.BAD_REQUEST,
    message: {
      en: 'Bad request',
      tr: 'Geçersiz istek',
    },
  },
  INTERNAL_SERVER_ERROR: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: {
      en: 'Internal server error',
      tr: 'Sunucu hatası',
    },
  },
  DEVICE_WITH_THIS_SERIAL_NUMBER_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Device with this serial number already exists',
      tr: 'Bu seri numarası ile kayıtlı cihaz zaten mevcut',
    },
  },
  DEVICE_WITH_THIS_ASSET_TAG_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Device with this asset tag already exists',
      tr: 'Bu asset tag ile kayıtlı cihaz zaten mevcut',
    },
  },
  CANNOT_DELETE_ASSIGNED_DEVICE: {
    status: HttpStatus.FORBIDDEN,
    message: {
      en: 'Cannot delete device that is currently assigned',
      tr: 'Atanmış cihaz silinemez',
    },
  },
  FORBIDDEN: {
    status: HttpStatus.FORBIDDEN,
    message: {
      en: 'Access forbidden',
      tr: 'Erişim yasak',
    },
  },
  ROLE_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Role not found',
      tr: 'Rol bulunamadı',
    },
  },
  ROLE_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Role with this name already exists in the branch',
      tr: 'Bu şubede bu isimle bir rol zaten mevcut',
    },
  },
  CANNOT_UPDATE_SYSTEM_ROLE: {
    status: HttpStatus.FORBIDDEN,
    message: {
      en: 'Cannot update system role',
      tr: 'Sistem rolü güncellenemez',
    },
  },
  CANNOT_DELETE_SYSTEM_ROLE: {
    status: HttpStatus.FORBIDDEN,
    message: {
      en: 'Cannot delete system role',
      tr: 'Sistem rolü silinemez',
    },
  },
  ROLE_HAS_ASSIGNED_USERS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete role that has assigned users',
      tr: 'Atanmış kullanıcıları olan rol silinemez',
    },
  },
  TITLE_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Title not found',
      tr: 'Ünvan bulunamadı',
    },
  },
  TITLE_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Title with this name already exists',
      tr: 'Bu isimle bir ünvan zaten mevcut',
    },
  },
  TITLE_HAS_ASSIGNED_USERS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete title that has assigned users',
      tr: 'Atanmış kullanıcıları olan ünvan silinemez',
    },
  },
  COMPANY_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Company not found',
      tr: 'Şirket bulunamadı',
    },
  },
  CANNOT_DELETE_EDUSAMA: {
    status: HttpStatus.FORBIDDEN,
    message: {
      en: 'Cannot delete Edusama',
      tr: 'Edusama silinemez',
    },
  },
  COMPANY_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Company with this name already exists',
      tr: 'Bu isimle bir şirket zaten mevcut',
    },
  },
  COMPANY_HAS_BRANCHES: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete company that has branches',
      tr: 'Şubeleri olan şirket silinemez',
    },
  },
  BRANCH_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Branch not found',
      tr: 'Şube bulunamadı',
    },
  },
  SLUG_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Branch with this slug already exists',
      tr: 'Bu slug ile bir şube zaten mevcut',
    },
  },
  BRANCH_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Branch with this name already exists in the company',
      tr: 'Bu şirkette bu isimle bir şube zaten mevcut',
    },
  },
  CANNOT_DELETE_BRANCH: {
    status: HttpStatus.FORBIDDEN,
    message: {
      en: 'Cannot delete this branch',
      tr: 'Bu şube silinemez',
    },
  },
  BRANCH_HAS_ASSOCIATED_DATA: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete branch that has associated data',
      tr: 'İlişkili verisi olan şube silinemez',
    },
  },
  DEVICE_NOT_AVAILABLE_FOR_ASSIGNMENT: {
    status: HttpStatus.BAD_REQUEST,
    message: {
      en: 'Device is not available for assignment',
      tr: 'Cihaz atanamaz',
    },
  },
  ASSIGNMENT_NOT_ACTIVE: {
    status: HttpStatus.BAD_REQUEST,
    message: {
      en: 'Assignment is not active',
      tr: 'Atama aktif değil',
    },
  },
  SUBJECT_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Subject not found',
      tr: 'Ders bulunamadı',
    },
  },
  SUBJECT_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Subject with this name already exists in the branch',
      tr: 'Bu şubede bu isimle bir ders zaten mevcut',
    },
  },
  SUBJECT_HAS_ASSOCIATED_DATA: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete subject that has integrated classrooms',
      tr: 'Bu ders bir sınıfa atanmış durumda olduğu için silinemez',
    },
  },
  CURRICULUM_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Curriculum not found',
      tr: 'Müfredat bulunamadı',
    },
  },
  CURRICULUM_HAS_INTEGRATED_CLASSROOMS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete curriculum that has integrated classrooms',
      tr: 'Bu müfredat bir sınıfa atanmış durumda olduğu için silinemez',
    },
  },
  CURRICULUM_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Curriculum with this name already exists for this subject',
      tr: 'Bu ders için bu isimle bir müfredat zaten mevcut',
    },
  },
  CURRICULUM_HAS_LESSONS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete curriculum that has lessons',
      tr: 'Dersi olan müfredat silinemez',
    },
  },
  UNIT_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Unit not found',
      tr: 'Birim bulunamadı',
    },
  },
  UNIT_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Unit with this name already exists in this curriculum',
      tr: 'Bu müfredatta bu isimle bir birim zaten mevcut',
    },
  },
  UNIT_HAS_ASSOCIATED_DATA: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete unit that has associated data',
      tr: 'İlişkili verisi olan birim silinemez',
    },
  },
  UNIT_HAS_LESSONS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete unit that has lessons',
      tr: 'Dersi olan birim silinemez',
    },
  },
  LESSON_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Lesson not found',
      tr: 'Ders saati bulunamadı',
    },
  },
  LESSON_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Lesson with this name already exists in this curriculum',
      tr: 'Bu müfredatta bu isimle bir ders saati zaten mevcut',
    },
  },
  LESSON_HAS_ASSOCIATED_DATA: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete lesson that has associated data',
      tr: 'İlişkili verisi olan ders saati silinemez',
    },
  },
  CLASSROOM_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Classroom not found',
      tr: 'Sınıf bulunamadı',
    },
  },
  CLASSROOM_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Classroom with this name already exists in the branch',
      tr: 'Bu şubede bu isimle bir sınıf zaten mevcut',
    },
  },
  CLASSROOM_HAS_ASSOCIATED_DATA: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete classroom that has associated data',
      tr: 'İlişkili verisi olan sınıf silinemez',
    },
  },
  CLASSROOM_TEMPLATE_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Classroom template not found',
      tr: 'Sınıf şablonu bulunamadı',
    },
  },
  CLASSROOM_TEMPLATE_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Classroom template with this name already exists in the branch',
      tr: 'Bu şubede bu isimle bir sınıf şablonu zaten mevcut',
    },
  },
  CLASSROOM_TEMPLATE_HAS_ASSOCIATED_DATA: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete classroom template that has associated data',
      tr: 'İlişkili verisi olan sınıf şablonu silinemez',
    },
  },
  ANNOUNCEMENT_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Announcement not found',
      tr: 'Duyuru bulunamadı',
    },
  },
  STUDENT_NOT_ENROLLED: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Student not enrolled',
      tr: 'Öğrenci kayıtlı değil',
    },
  },
  CLASSROOM_AT_CAPACITY: {
    status: HttpStatus.BAD_REQUEST,
    message: {
      en: 'Classroom is at capacity',
      tr: 'Sınıf kapasitesi dolu',
    },
  },
  MODULE_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Module not found',
      tr: 'Modül bulunamadı',
    },
  },
  MODULE_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Module with this code or name already exists',
      tr: 'Bu kod veya isim ile bir modül zaten mevcut',
    },
  },
  MODULE_HAS_ASSOCIATED_DATA: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete module that has associated data',
      tr: 'İlişkili verisi olan modül silinemez',
    },
  },
  MODULE_CANNOT_BE_DELETED: {
    status: HttpStatus.FORBIDDEN,
    message: {
      en: 'This module cannot be deleted',
      tr: 'Bu modül silinemez',
    },
  },
  PERMISSION_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Permission not found',
      tr: 'İzin bulunamadı',
    },
  },
  PERMISSION_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Permission with this name already exists for this module',
      tr: 'Bu modül için bu isimle bir izin zaten mevcut',
    },
  },
  PERMISSION_HAS_ROLES: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete permission that has assigned roles',
      tr: 'Atanmış rolleri olan izin silinemez',
    },
  },
  ATTENDANCE_RECORD_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Attendance record not found',
      tr: 'Devam kaydı bulunamadı',
    },
  },
  ATTENDANCE_SUMMARY_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Attendance summary not found',
      tr: 'Devam özeti bulunamadı',
    },
  },
  ATTENDANCE_NOTIFICATION_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Attendance notification not found',
      tr: 'Devam bildirimi bulunamadı',
    },
  },
  CLASSROOM_INTEGRATION_SESSION_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Classroom integration session not found',
      tr: 'Sınıf entegrasyon oturumu bulunamadı',
    },
  },
  CLASSROOM_INTEGRATION_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Classroom integration not found',
      tr: 'Sınıf entegrasyonu bulunamadı',
    },
  },
  QUESTION_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Question not found',
      tr: 'Soru bulunamadı',
    },
  },
  QUESTION_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Question with this text already exists in this lesson',
      tr: 'Bu ders için bu metinle bir soru zaten mevcut',
    },
  },
  QUESTION_HAS_RESPONSES: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Cannot delete question that has responses',
      tr: 'Cevapları olan soru silinemez',
    },
  },
  QUESTION_NOT_ENOUGH: {
    status: HttpStatus.BAD_REQUEST,
    message: {
      en: 'Not enough questions is available in the system',
      tr: 'Sistemde yeterli soru sayısı bulunamadı',
    },
  },
  ASSESSMENT_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Assessment not found',
      tr: 'Değerlendirme bulunamadı',
    },
  },
  LESSON_MATERIAL_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Lesson material not found',
      tr: 'Ders materyali bulunamadı',
    },
  },
  LESSON_MATERIAL_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: {
      en: 'Lesson material with this name already exists in this lesson',
      tr: 'Bu ders için bu isimle bir ders materyali zaten mevcut',
    },
  },
  LESSON_MATERIAL_VIDEO_NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: {
      en: 'Lesson material video not found',
      tr: 'Ders materyali video bulunamadı',
    },
  },
} satisfies Record<string, CustomErrorType>;
