import {
  MODULE_CODES,
  ModuleCode,
  Permission,
  SYSTEM_ROLES,
  SystemRole,
} from '@edusama/common';
import {
  AssignmentStatus,
  AssessmentStatus,
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

import { countries } from './countriesTr';

export const common = {
  countries,
  assignmentStatuses: {
    [AssignmentStatus.ACTIVE]: 'Aktif',
    [AssignmentStatus.RETURNED]: 'İade Edildi',
    [AssignmentStatus.PENDING_RETURN]: 'İade Bekleniyor',
    [AssignmentStatus.LOST]: 'Kayıp',
    [AssignmentStatus.DAMAGED]: 'Hasarlı',
  } satisfies Record<AssignmentStatus, string>,
  attendanceNotificationStatuses: {
    [NotificationStatus.PENDING]: 'Bekliyor',
    [NotificationStatus.SENT]: 'Gönderildi',
    [NotificationStatus.ACKNOWLEDGED]: 'Onaylandı',
    [NotificationStatus.FAILED]: 'Başarısız',
  } satisfies Record<NotificationStatus, string>,
  attendanceNotificationTypes: {
    [AttendanceNotificationType.ATTENDANCE_VIOLATION]: 'Katılım İhlali',
    [AttendanceNotificationType.REMINDER]: 'Hatırlatma',
    [AttendanceNotificationType.WEEKLY_SUMMARY]: 'Haftalık Özet',
    [AttendanceNotificationType.MONTHLY_SUMMARY]: 'Aylık Özet',
  } satisfies Record<AttendanceNotificationType, string>,
  attendanceStatuses: {
    [AttendanceStatus.PRESENT]: 'Mevcut',
    [AttendanceStatus.ABSENT]: 'Yok',
    [AttendanceStatus.PARTIAL]: 'Kısmi',
    [AttendanceStatus.LATE]: 'Geç',
    [AttendanceStatus.EXCUSED]: 'Mazeretli',
  } satisfies Record<AttendanceStatus, string>,
  branchStatuses: {
    [BranchStatus.ACTIVE]: 'Aktif',
    [BranchStatus.SUSPENDED]: 'Askıya Alındı',
  } satisfies Record<BranchStatus, string>,
  classroomIntegrationStatuses: {
    [ClassroomIntegrationStatus.ACTIVE]: 'Aktif',
    [ClassroomIntegrationStatus.COMPLETED]: 'Tamamlandı',
    [ClassroomIntegrationStatus.SUSPENDED]: 'Askıya Alındı',
  } satisfies Record<ClassroomIntegrationStatus, string>,
  classroomStatuses: {
    [ClassroomStatus.ACTIVE]: 'Aktif',
    [ClassroomStatus.SUSPENDED]: 'Askıya Alındı',
    [ClassroomStatus.TERMINATED]: 'Sonlandırıldı',
  } satisfies Record<ClassroomStatus, string>,
  classroomTemplateStatuses: {
    [ClassroomTemplateStatus.ACTIVE]: 'Aktif',
    [ClassroomTemplateStatus.SUSPENDED]: 'Askıya Alındı',
    [ClassroomTemplateStatus.TERMINATED]: 'Sonlandırıldı',
  } satisfies Record<ClassroomTemplateStatus, string>,
  companyStatuses: {
    [CompanyStatus.ACTIVE]: 'Aktif',
    [CompanyStatus.SUSPENDED]: 'Askıya Alındı',
  } satisfies Record<CompanyStatus, string>,
  curriculumStatuses: {
    [CurriculumStatus.ACTIVE]: 'Aktif',
    [CurriculumStatus.SUSPENDED]: 'Askıya Alındı',
    [CurriculumStatus.TERMINATED]: 'Sonlandırıldı',
  } satisfies Record<CurriculumStatus, string>,
  days: {
    [DayOfWeek.MONDAY]: 'Pazartesi',
    [DayOfWeek.TUESDAY]: 'Salı',
    [DayOfWeek.WEDNESDAY]: 'Çarşamba',
    [DayOfWeek.THURSDAY]: 'Perşembe',
    [DayOfWeek.FRIDAY]: 'Cuma',
    [DayOfWeek.SATURDAY]: 'Cumartesi',
    [DayOfWeek.SUNDAY]: 'Pazar',
  },
  deviceConditions: {
    [DeviceCondition.NEW]: 'Yeni',
    [DeviceCondition.EXCELLENT]: 'Mükemmel',
    [DeviceCondition.GOOD]: 'İyi',
    [DeviceCondition.FAIR]: 'Orta',
    [DeviceCondition.POOR]: 'Kötü',
    [DeviceCondition.DAMAGED]: 'Hasarlı',
  } satisfies Record<DeviceCondition, string>,
  deviceStatuses: {
    [DeviceStatus.AVAILABLE]: 'Mevcut',
    [DeviceStatus.ASSIGNED]: 'Atanmış',
    [DeviceStatus.IN_REPAIR]: 'Onarımda',
    [DeviceStatus.RETIRED]: 'Satıldı',
    [DeviceStatus.LOST]: 'Kayıp',
    [DeviceStatus.STOLEN]: 'Çalındı',
  } satisfies Record<DeviceStatus, string>,
  deviceTypes: {
    [DeviceType.LAPTOP]: 'Laptop',
    [DeviceType.DESKTOP]: 'Masaüstü',
    [DeviceType.TABLET]: 'Tablet',
    [DeviceType.SMARTPHONE]: 'Akıllı Telefon',
    [DeviceType.MONITOR]: 'Ekran',
    [DeviceType.KEYBOARD]: 'Klavye',
    [DeviceType.MOUSE]: 'Fare',
    [DeviceType.HEADSET]: 'Kulaklık',
    [DeviceType.WEBCAM]: 'Web Kamera',
    [DeviceType.PRINTER]: 'Yazıcı',
    [DeviceType.OTHER]: 'Diğer',
  } satisfies Record<DeviceType, string>,
  enrollmentStatuses: {
    [EnrollmentStatus.ENROLLED]: 'Kayıtlı',
    [EnrollmentStatus.WITHDRAWN]: 'İptal Edildi',
    [EnrollmentStatus.COMPLETED]: 'Tamamlandı',
  } satisfies Record<EnrollmentStatus, string>,
  genders: {
    [Gender.MALE]: 'Erkek',
    [Gender.FEMALE]: 'Kadın',
    [Gender.OTHER]: 'Diğer',
  } satisfies Record<Gender, string>,
  languages: {
    [Language.EN]: 'İngilizce',
    [Language.TR]: 'Türkçe',
    [Language.DE]: 'Almanca',
    [Language.ES]: 'İspanyolca',
    [Language.FR]: 'Fransızca',
    [Language.IT]: 'İtalyanca',
    [Language.PT]: 'Portekizce',
    [Language.RU]: 'Rusça',
    [Language.ZH]: 'Çince',
    [Language.JA]: 'Japonca',
  } satisfies Record<Language, string>,
  moduleDescriptions: {
    [MODULE_CODES.subjects]: 'Konuları ve konuların öğretmenlerini yönetin',
    [MODULE_CODES.accounting]:
      'Kurum için mali kayıtları, faturaları ve ödeme takibini yönetin',
    [MODULE_CODES.assessment]:
      'Detaylı analizlerle quiz, test ve değerlendirmeler oluşturun ve yönetin',
    [MODULE_CODES.assignments]:
      'Otomatik notlandırma ve geri bildirim ile görev, proje ve ödev atayın',
    [MODULE_CODES.recordedLiveClasses]:
      'Canlı oturumları kaydedin ve eğitim içeriğine isteğe bağlı erişim sağlayın',
    [MODULE_CODES.attendance]:
      'Otomatik raporlama ve bildirimlerle öğrenci katılımını takip edin',
    [MODULE_CODES.materials]:
      'Kurs materyallerini ve kaynaklarını yükleyin, düzenleyin ve dağıtın',
    [MODULE_CODES.branches]:
      'Çoklu şube konumlarını ve yapılandırmalarını yönetin',
    [MODULE_CODES.modules]:
      'Sistem modüllerini ve kullanılabilirliğini kontrol edin ve yapılandırın',
    [MODULE_CODES.usersAndRoles]:
      'Kullanıcı hesaplarını, yetkileri ve rol tabanlı erişim kontrolünü yönetin',
    [MODULE_CODES.profile]:
      'Kullanıcı profillerini ve kişisel bilgileri yönetin',
    [MODULE_CODES.teachers]:
      'Öğretmen hesaplarını, programlarını ve performans takibini yönetin',
    [MODULE_CODES.students]:
      'Öğrenci kayıtlarını, ilerlemelerini ve akademik kayıtlarını yönetin',
    [MODULE_CODES.parents]: 'Veli hesaplarını ve velilerle iletişimi yönetin',
    [MODULE_CODES.classrooms]:
      'Sınıf şablonlarını ve yapılandırmalarını oluşturun ve yönetin',
    [MODULE_CODES.liveStreamSettings]:
      'Canlı yayın ayarlarını ve yayın seçeneklerini yapılandırın',
    [MODULE_CODES.certificates]:
      'Kurs tamamlama ve başarılar için dijital sertifika düzenleyin ve yönetin',
    [MODULE_CODES.paymentGateways]:
      'Ödeme işlemcilerini ve işlem yönetimini yapılandırın',
    [MODULE_CODES.payments]:
      'Ödemeleri işleyin, abonelikleri yönetin ve faturalandırmayı gerçekleştirin',
    [MODULE_CODES.productsAndServices]:
      'Eğitim ürünlerini ve hizmet tekliflerini yönetin',
    [MODULE_CODES.onlineStore]:
      'Eğitim ürünleri için çevrimiçi pazar yeri işletin',
    [MODULE_CODES.videoCourses]:
      'Video tabanlı öğrenme içeriği oluşturun ve yönetin',
    [MODULE_CODES.inventory]:
      'Eğitim kaynaklarını ve ekipmanlarını takip edin ve yönetin',
    [MODULE_CODES.agreements]:
      'Sözleşmeleri, hizmet şartlarını ve yasal belgeleri yönetin',
    [MODULE_CODES.humanResources]:
      'Çalışan yönetimini, bordro ve İK işlemlerini gerçekleştirin',
    [MODULE_CODES.smartReports]:
      'Analizler için akıllı raporlar ve içgörüler üretin',
    [MODULE_CODES.announcements]:
      'Sistem genelinde duyurular oluşturun ve dağıtın',
    [MODULE_CODES.helpDesk]: 'Müşteri desteği ve teknik yardım sağlayın',
    [MODULE_CODES.notifications]:
      'Bildirim tercihlerini ve sistem uyarılarını yönetin',
    [MODULE_CODES.settings]: 'Sistem ayarlarını ve tercihlerini yapılandırın',
    [MODULE_CODES.aiMentor]:
      'AI destekli mentorluk ve kişiselleştirilmiş öğrenme yardımı',
    [MODULE_CODES.aiChat]: 'Öğrenci desteği ve sorular için akıllı chatbot',
    [MODULE_CODES.aiAutoMaterialCreation]:
      'AI kullanarak eğitim içeriğini otomatik olarak üretin',
  } satisfies Record<ModuleCode, string>,
  moduleNames: {
    [MODULE_CODES.subjects]: 'Konular',
    [MODULE_CODES.accounting]: 'Muhasebe',
    [MODULE_CODES.assessment]: 'Değerlendirme',
    [MODULE_CODES.assignments]: 'Atamalar',
    [MODULE_CODES.recordedLiveClasses]: 'Canlı Oturumlar',
    [MODULE_CODES.attendance]: 'Katılım',
    [MODULE_CODES.materials]: 'Materyaller',
    [MODULE_CODES.branches]: 'Şubeler',
    [MODULE_CODES.modules]: 'Modüller',
    [MODULE_CODES.usersAndRoles]: 'Kullanıcılar ve Roller',
    [MODULE_CODES.profile]: 'Profil',
    [MODULE_CODES.teachers]: 'Öğretmenler',
    [MODULE_CODES.students]: 'Öğrenciler',
    [MODULE_CODES.parents]: 'Veli',
    [MODULE_CODES.classrooms]: 'Sınıflar',
    [MODULE_CODES.liveStreamSettings]: 'Canlı Yayın Ayarları',
    [MODULE_CODES.certificates]: 'Sertifikalar',
    [MODULE_CODES.paymentGateways]: 'Ödeme İşlemcileri',
    [MODULE_CODES.payments]: 'Ödemeler',
    [MODULE_CODES.productsAndServices]: 'Ürünler ve Hizmetler',
    [MODULE_CODES.onlineStore]: 'Çevrimiçi Pazar Yeri',
    [MODULE_CODES.videoCourses]: 'Video Kurslar',
    [MODULE_CODES.inventory]: 'Envanter',
    [MODULE_CODES.agreements]: 'Sözleşmeler',
    [MODULE_CODES.humanResources]: 'İnsan Kaynakları',
    [MODULE_CODES.smartReports]: 'Akıllı Raporlar',
    [MODULE_CODES.announcements]: 'Duyurular',
    [MODULE_CODES.helpDesk]: 'Müşteri Desteği',
    [MODULE_CODES.notifications]: 'Bildirimler',
    [MODULE_CODES.settings]: 'Ayarlar',
    [MODULE_CODES.aiMentor]: 'AI Mentor',
    [MODULE_CODES.aiChat]: 'AI Chat',
    [MODULE_CODES.aiAutoMaterialCreation]: 'AI Auto Material Creation',
  } satisfies Record<ModuleCode, string>,
  moduleStatuses: {
    [ModuleStatus.ACTIVE]: 'Aktif',
    [ModuleStatus.INACTIVE]: 'Pasif',
    [ModuleStatus.DELETED]: 'Silindi',
  } satisfies Record<ModuleStatus, string>,
  roleStatuses: {
    [RoleStatus.ACTIVE]: 'Aktif',
    [RoleStatus.SUSPENDED]: 'Askıya Alındı',
  } satisfies Record<RoleStatus, string>,
  studentStatuses: {
    [StudentStatus.ACTIVE]: 'Aktif',
    [StudentStatus.SUSPENDED]: 'Askıya Alındı',
    [StudentStatus.INVITED]: 'Davet Gönderildi',
    [StudentStatus.REQUESTED_APPROVAL]: 'Onay Bekliyor',
    [StudentStatus.REQUESTED_CHANGES]: 'Değişiklikler Bekleniyor',
    [StudentStatus.REJECTED]: 'Reddedildi',
  } satisfies Record<StudentStatus, string>,
  assessmentStatuses: {
    [AssessmentStatus.ACTIVE]: 'Aktif',
    [AssessmentStatus.SUSPENDED]: 'Askıya Alındı',
    [AssessmentStatus.TERMINATED]: 'Sonlandırıldı',
  } satisfies Record<AssessmentStatus, string>,
  assessmentScheduleTypes: {
    [ScheduleType.FLEXIBLE]: 'Esnek',
    [ScheduleType.STRICT]: 'Kesin',
  } satisfies Record<ScheduleType, string>,
  assessmentScoringTypes: {
    [ScoringType.MANUAL]: 'Manuel',
    [ScoringType.AUTOMATIC]: 'Otomatik',
  } satisfies Record<ScoringType, string>,
  subjectStatuses: {
    [SubjectStatus.ACTIVE]: 'Aktif',
    [SubjectStatus.SUSPENDED]: 'Askıya Alındı',
    [SubjectStatus.TERMINATED]: 'Sonlandırıldı',
  } satisfies Record<SubjectStatus, string>,
  themes: {
    [Theme.LIGHT]: 'Açık',
    [Theme.DARK]: 'Koyu',
  } satisfies Record<Theme, string>,
  userStatuses: {
    [UserStatus.ACTIVE]: 'Aktif',
    [UserStatus.SUSPENDED]: 'Askıya Alındı',
    [UserStatus.INVITED]: 'Davet Gönderildi',
  } satisfies Record<UserStatus, string>,
  questionTypes: {
    MULTIPLE_CHOICE: 'Çoktan Seçmeli',
    TRUE_FALSE: 'Doğru/Yanlış',
    SHORT_ANSWER: 'Kısa Cevap',
    ESSAY: 'Kompozisyon',
    FILL_IN_BLANK: 'Boşluk Doldurma',
    MATCHING: 'Eşleştirme',
    ORDERING: 'Sıralama',
  },
  trueFalseOptions: {
    true: 'Doğru',
    false: 'Yanlış',
  },
  questionDifficulties: {
    EASY: 'Kolay',
    MEDIUM: 'Orta',
    HARD: 'Zor',
  } satisfies Record<QuestionDifficulty, string>,
  systemRoles: {
    [SYSTEM_ROLES.superAdmin]: 'Süper Admin',
    [SYSTEM_ROLES.admin]: 'Admin',
    [SYSTEM_ROLES.branchManager]: 'Şube Yöneticisi',
    [SYSTEM_ROLES.moduleManager]: 'Modül Yöneticisi',
    [SYSTEM_ROLES.teacher]: 'Öğretmen',
    [SYSTEM_ROLES.staff]: 'Personel',
  } satisfies Record<SystemRole, string>,
  permissionNames: {
    read: 'Okuma',
    write: 'Yazma',
    delete: 'Silme',
  } satisfies Record<Permission, string>,
  combobox: {
    selectOption: 'Seçenek seçin...',
    search: 'Ara...',
    noOptionFound: 'Seçenek bulunamadı.',
    selectParent: 'Veli seçin...',
    searchParents: 'Veli ara...',
    noParentsFound: 'Veli bulunamadı',
  },
  common: {
    myChildren: 'Çocuklarım',
    search: 'Ara...',
    title: 'Başlık',
    updating: 'Güncelleniyor...',
    // common validation messages
    details: 'Detaylar',
    unknownError: 'Bilinmeyen bir hata',
    requiredField: 'Zorunlu alan',
    numberValueMinError: 'Değer en az {{count}} olmalıdır',
    numberValueMaxError: 'Değer en fazla {{count}} olmalıdır',
    stringValueMinLengthError: 'Değer en az {{count}} karakter içermelidir',
    stringValueMaxLengthError: 'Değer en fazla {{count}} karakter içermelidir',
    invalidEmail: 'Geçersiz e-posta formatı',
    nationalIdInvalid: 'Geçersiz T.C. Kimlik No',
    phoneNumberInvalid: 'Geçersiz telefon numarası',
    invalidUrl: 'Geçersiz URL formatı',
    endDateMustBeAfterStartDate:
      'Bitiş tarihi başlangıç tarihinden sonra olmalıdır',
    sessionMustBeOnSameDay: 'Oturum aynı gün içinde olmalıdır',
    allStudentsMustHaveAttendanceRecord:
      'Tüm öğrencilerin yoklama kaydı yapılmak zorundadır',
    passwordsDoNotMatch: 'Şifreler eşleşmiyor',
    actions: 'İşlemler',
    remove: 'Kaldır',
    resetFilters: 'Filtreleri Sıfırla',
    reset: 'Sıfırla',
    next: 'Sonraki',
    pagination: {
      showing: 'Gösteriliyor',
      of: '/',
      results: 'sonuç',
    },
    saveChanges: 'Değişiklikleri Kaydet',
    saveAndContinue: 'Kaydet ve Devam Et',
    createAndContinue: 'Oluştur ve Devam Et',
    previous: 'Önceki',
    finish: 'Bitir',
    save: 'Kaydet',
    active: 'Aktif',
    and: 've',
    anErrorOccurred: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
    yes: 'Evet',
    no: 'Hayır',
    cancel: 'İptal',
    continue: 'Devam et',
    curriculums: 'Müfredatlar',
    close: 'Kapat',
    email: 'Email',
    createdAt: 'Oluşturulma Tarihi',
    updatedAt: 'Güncellenme Tarihi',
    lastUpdatedAt: 'Son Güncellenme Tarihi',
    statusUpdatedAt: 'Statü Güncellenme Tarihi',
    deletedAt: 'Silinme Tarihi',
    or: 'veya',
    password: 'Şifre',
    pleaseEnterYourEmail: 'Lütfen emailinizi giriniz',
    selectDate: 'Tarih seçiniz',
    // Common form fields
    firstName: 'Ad',
    lastName: 'Soyad',
    username: 'Kullanıcı Adı',
    phoneNumber: 'Telefon Numarası',
    nationalId: 'T.C. Kimlik No',
    dateOfBirth: 'Doğum Tarihi',
    questions: 'soru',
    ratio: 'oran',
    gender: 'Cinsiyet',
    country: 'Ülke',
    city: 'Şehir',
    inactive: 'Askıya Alındı',
    state: 'Eyalet',
    address: 'Adres',
    zipCode: 'Posta Kodu',
    profilePictureUrl: 'Profil Fotoğrafı',
    fullName: 'Ad Soyad',
    status: 'Statü',
    type: 'Tür',
    parent: 'Veli',
    role: 'Rol',
    entity: 'Varlık',
    reason: 'Sebep',
    note: 'Not',
    description: 'Açıklama',
    subject: 'Konu',
    selectSubject: 'Bir konu seçin',
    taughtSubjects: 'Öğretilen Konular',
    selectTaughtSubjects: 'Öğretilen konuları seçin',
    searchTaughtSubjects: 'Öğretilen konuları ara...',
    searchSubjects: 'Konu ara...',
    noSubjectsFound: 'Konu bulunamadı',
    subjectRequired: 'Konu zorunludur',
    name: 'Ad',
    curriculum: 'Müfredat',
    lessons: 'Dersler',
    // Social media
    facebook: 'Facebook',
    twitter: 'X (Twitter)',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    statusUpdateReason: 'Statü Güncelleme Nedeni',
    selectStatus: 'Statü seçiniz',
    // Common placeholders
    selectGender: 'Cinsiyet seçiniz',
    selectDateOfBirth: 'Doğum tarihi seçiniz',
    // Common validation messages
    required: 'zorunludur',

    invalidValue: 'Geçersiz değer',
    tooLong: 'çok uzun',
    noDateSelected: 'Tarih seçilmemiş',
    enrolledAt: 'Kayıt Tarihi',
    emailInvalid: 'Lütfen geçerli bir email giriniz',
    profilePictureFileSizeError: "Dosya boyutu 2MB'den küçük olmalıdır",
    profilePictureFileTypeError:
      'Sadece JPEG, PNG ve WebP resim formatları kabul edilir',
    statusUpdateReasonRequired:
      'Reddedilen veya değişiklik istenen durumlar için güncelleme nedeni zorunludur',
    returnToHomepage: 'Ana sayfaya dön',
    clickHereToLogin: 'Giriş yapmak için tıklayın',
    // Confirmation dialog
    confirmClose: 'Kapatmayı Onayla',
    unsavedChangesWarning:
      'Kaydedilmemiş değişiklikleriniz var. Kaydetmeden kapatmak istediğinizden emin misiniz?',
    discardChanges: 'Değişikliklerden vazgeç',
    create: 'Oluştur',
    update: 'Güncelle',
    optional: 'Opsiyonel',
    changeImage: 'Resmi Değiştir',
    uploadImage: 'Resim Yükle',
    imageUploadHelp:
      'Resme tıklayın veya sürükleyin • PNG, JPG, WEBP en fazla 2MB',
    imagePreview: 'Resim Önizleme',
    imagePreviewDescription: 'Tam boyutta görüntülemek için tıklayın',
    capacity: 'Kapasite',
    startDate: 'Başlangıç Tarihi',
    endDate: 'Bitiş Tarihi',
    accessLink: 'Erişim Linki',
    view: 'Görüntüle',
    edit: 'Düzenle',
    suspend: 'Askıya Al',
    activate: 'Aktifleştir',
    changePassword: 'Şifre Değiştir',
    delete: 'Sil',
    loading: 'Yükleniyor...',
    loadingContent: 'İçeriğinizi yüklerken lütfen bekleyin...',
    back: 'Geri',
    noRecord: 'Kayıt yok',
    pleaseEnsureAllFieldsAreValid: 'Lütfen tüm alanları doğru giriniz',
    pleaseFillInAllRequiredFields: 'Lütfen tüm zorunlu alanları doldurunuz',
    select: 'Seçin',
  },
  // Shared dialog translations
  dialogs: {
    invite: {
      titleStudent: 'Öğrenci Davet Et',
      descriptionStudent:
        'Yeni öğrenciyi okula katılmaya davet etmek için e-posta daveti gönderin.',
      titleTeacher: 'Öğretmen Davet Et',
      descriptionTeacher:
        'Yeni öğretmene katılmaya davet etmek için e-posta daveti gönderin.',
      titleParent: 'Veliyi Davet Et',
      descriptionParent:
        'Yeni veliyi okula katılmaya davet etmek için e-posta daveti gönderin.',
      titleUser: 'Kullanıcı Davet Et',
      descriptionUser:
        'Yeni kullanıcıyı sisteme katılmaya davet etmek için e-posta daveti gönderin.',
      form: {
        email: 'E-posta',
        type: 'Tür',
        description: 'Açıklama (isteğe bağlı)',
        selectType: 'Bir tür seçin',
        cancel: 'İptal',
        invite: 'Davet Et',
      },
      placeholders: {
        email: 'örn: ahmet.yilmaz@gmail.com',
        description: 'Davetinize kişisel bir not ekleyin (isteğe bağlı)',
      },
      successStudent: 'Öğrenci başarıyla davet edildi',
      successTeacher: 'Öğretmen başarıyla davet edildi',
      successParent: 'Veli başarıyla davet edildi',
      successUser: 'Kullanıcı başarıyla davet edildi',
    },
    delete: {
      titleStudent: 'Öğrenciyi Sil',
      confirmMessageStudent:
        'Öğrenci sistemden kalıcı olarak kaldırılacaktır. Devam etmek istediğinizden emin misiniz?',
      permanentRemovalWarningStudent:
        'Bu işlem öğrenciyi sistemden kalıcı olarak kaldıracaktır. Bu işlem geri alınamaz.',
      titleTeacher: 'Öğretmeni Sil',
      confirmMessageTeacher:
        'Öğretmen sistemden kalıcı olarak kaldırılacaktır. Devam etmek istediğinizden emin misiniz?',
      permanentRemovalWarningTeacher:
        'Bu işlem öğretmene sistemden kalıcı olarak kaldıracaktır. Bu işlem geri alınamaz.',
      titleParent: 'Veliyi Sil',
      confirmMessageParent:
        'Veli sistemden kalıcı olarak kaldırılacaktır. Devam etmek istediğinizden emin misiniz?',
      permanentRemovalWarningParent:
        'Bu işlem veliyi sistemden kalıcı olarak kaldıracaktır. Bu işlem geri alınamaz.',
      titleUser: 'Kullanıcıyı Sil',
      confirmMessageUser:
        'Kullanıcı sistemden kalıcı olarak kaldırılacaktır. Devam etmek istediğinizden emin misiniz?',
      permanentRemovalWarningUser:
        'Bu işlem kullanıcıyı sistemden kalıcı olarak kaldıracaktır. Bu işlem geri alınamaz.',
      warningTitle: 'Uyarı!',
      warningDescription: 'Lütfen dikkatli olun, bu işlem geri alınamaz.',
      confirmButtonText: 'Sil',
      successMessageStudent: 'Öğrenci başarıyla silindi',
      successMessageTeacher: 'Öğretmen başarıyla silindi',
      successMessageParent: 'Veli başarıyla silindi',
      successMessageUser: 'Kullanıcı başarıyla silindi',
      successMessageClassroomSession: 'Oturum başarıyla silindi',
      errorMessageClassroomSession: 'Oturum silinemedi. Lütfen tekrar deneyin.',
    },
    suspend: {
      titleStudent: 'Öğrenciyi Askıya Al',
      suspendTitleStudent: 'Öğrenciyi Askıya Al',
      activateTitleStudent: 'Öğrenciyi Aktifleştir',
      descriptionStudent:
        'Bu öğrenci hesabını askıya alarak geçici olarak erişimi kısıtlayın.',
      suspendDescriptionStudent:
        'Bu öğrenci hesabını askıya alarak geçici olarak erişimi kısıtlayın.',
      activateDescriptionStudent:
        'Bu öğrenci hesabını aktifleştirerek sisteme erişimi geri yükleyin.',
      confirmMessageStudent:
        'Öğrenci askıya alınacak ve sisteme erişemeyecektir. Devam etmek istediğinizden emin misiniz?',
      suspendedMessageStudent:
        'Öğrenci yeniden aktifleştirilecek ve sisteme erişimi geri kazanacaktır. Devam etmek istediğinizden emin misiniz?',
      titleTeacher: 'Öğretmeni Askıya Al',
      suspendTitleTeacher: 'Öğretmeni Askıya Al',
      activateTitleTeacher: 'Öğretmeni Aktifleştir',
      descriptionTeacher:
        'Bu öğretmen hesabını askıya alarak geçici olarak erişimi kısıtlayın.',
      suspendDescriptionTeacher:
        'Bu öğretmen hesabını askıya alarak geçici olarak erişimi kısıtlayın.',
      activateDescriptionTeacher:
        'Bu öğretmen hesabını aktifleştirerek sisteme erişimi geri yükleyin.',
      confirmMessageTeacher:
        'Öğretmen askıya alınacak ve sisteme erişemeyecektir. Devam etmek istediğinizden emin misiniz?',
      suspendedMessageTeacher:
        'Öğretmen yeniden aktifleştirilecek ve sisteme erişimi geri kazanacaktır. Devam etmek istediğinizden emin misiniz?',
      titleParent: 'Veliyi Askıya Al',
      suspendTitleParent: 'Veliyi Askıya Al',
      activateTitleParent: 'Veliyi Aktifleştir',
      descriptionParent:
        'Bu veli hesabını askıya alarak geçici olarak erişimi kısıtlayın.',
      suspendDescriptionParent:
        'Bu veli hesabını askıya alarak geçici olarak erişimi kısıtlayın.',
      activateDescriptionParent:
        'Bu veli hesabını aktifleştirerek sisteme erişimi geri yükleyin.',
      confirmMessageParent:
        'Veli askıya alınacak ve sisteme erişemeyecektir. Devam etmek istediğinizden emin misiniz?',
      suspendedMessageParent:
        'Veli yeniden aktifleştirilecek ve sisteme erişimi geri kazanacaktır. Devam etmek istediğinizden emin misiniz?',
      titleUser: 'Kullanıcıyı Askıya Al',
      suspendTitleUser: 'Kullanıcıyı Askıya Al',
      activateTitleUser: 'Kullanıcıyı Aktifleştir',
      descriptionUser:
        'Bu kullanıcı hesabını askıya alarak geçici olarak erişimi kısıtlayın.',
      suspendDescriptionUser:
        'Bu kullanıcı hesabını askıya alarak geçici olarak erişimi kısıtlayın.',
      activateDescriptionUser:
        'Bu kullanıcı hesabını aktifleştirerek sisteme erişimi geri yükleyin.',
      confirmMessageUser:
        'Kullanıcı askıya alınacak ve sisteme erişemeyecektir. Devam etmek istediğinizden emin misiniz?',
      suspendedMessageUser:
        'Kullanıcı yeniden aktifleştirilecek ve sisteme erişimi geri kazanacaktır. Devam etmek istediğinizden emin misiniz?',
      warningTitle: 'Uyarı!',
      warningDescriptionStudent:
        'Bu işlem öğrencinin hesap statüsünu değiştirecektir. Bu işlemi daha sonra geri alabilirsiniz.',
      warningDescriptionTeacher:
        'Bu işlem öğretmenin hesap statüsünu değiştirecektir. Bu işlemi daha sonra geri alabilirsiniz.',
      warningDescriptionParent:
        'Bu işlem velinin hesap statüsünu değiştirecektir. Bu işlemi daha sonra geri alabilirsiniz.',
      warningDescriptionUser:
        'Bu işlem kullanıcının hesap statüsünu değiştirecektir. Bu işlemi daha sonra geri alabilirsiniz.',
      statusUpdateReasonLabel: 'Askıya alınma nedeni',
      statusUpdateReasonPlaceholderStudent:
        'Bu öğrenciyi askıya alma nedeninizi belirtin...',
      statusUpdateReasonPlaceholderTeacher:
        'Bu öğretmeni askıya alma nedeninizi belirtin...',
      statusUpdateReasonPlaceholderParent:
        'Bu veliyi askıya alma nedeninizi belirtin...',
      statusUpdateReasonPlaceholderUser:
        'Bu kullanıcıyı askıya alma nedeninizi belirtin...',
      statusUpdateReasonRequired: 'Askıya alınma nedeni zorunludur',
      confirmButtonText: 'Askıya Al',
      suspendButtonText: 'Askıya Al',
      activateButtonText: 'Aktifleştir',
      reactivateButtonText: 'Yeniden Aktifleştir',
      cancel: 'İptal',
      successMessageStudent: 'Öğrenci statüsü başarıyla güncellendi',
      successMessageTeacher: 'Öğretmen statüsü başarıyla güncellendi',
      successMessageParent: 'Veli statüsü başarıyla güncellendi',
      successMessageUser: 'Kullanıcı statüsü başarıyla güncellendi',
      errorMessageStudent:
        'Öğrenci statüsü güncellenemedi. Lütfen tekrar deneyin.',
      errorMessageTeacher:
        'Öğretmen statüsü güncellenemedi. Lütfen tekrar deneyin.',
      errorMessageParent: 'Veli statüsü güncellenemedi. Lütfen tekrar deneyin.',
      errorMessageUser:
        'Kullanıcı statüsü güncellenemedi. Lütfen tekrar deneyin.',
      successMessageAssessment: 'Değerlendirme statüsü başarıyla güncellendi',
      errorMessageAssessment:
        'Değerlendirme statüsü güncellenemedi. Lütfen tekrar deneyin.',
      titleAssessment: 'Değerlendirmeyi Askıya Al',
      suspendTitleAssessment: 'Değerlendirmeyi Askıya Al',
      activateTitleAssessment: 'Değerlendirmeyi Aktifleştir',
      descriptionAssessment:
        'Bu değerlendirmeyi askıya almak için erişimi geçici olarak kısıtlayın.',
      suspendDescriptionAssessment:
        'Bu değerlendirmeyi askıya almak için erişimi geçici olarak kısıtlayın.',
      activateDescriptionAssessment:
        'Bu değerlendirmeyi aktifleştirerek sisteme erişimi geri yükleyin.',
      confirmMessageAssessment:
        'Değerlendirme askıya alınacak ve kullanılamayacak. Devam etmek istediğinizden emin misiniz?',
      suspendedMessageAssessment:
        'Değerlendirme yeniden aktifleştirilecek ve kullanıma uygun hale gelecek. Devam etmek istediğinizden emin misiniz?',
      warningDescriptionAssessment:
        'Bu eylem değerlendirmenin durumunu değiştirecek. Bu eylemi daha sonra geri alabilirsiniz.',
      statusUpdateReasonPlaceholderAssessment:
        'Bu değerlendirmeyi askıya alma nedeninizi belirtin...',
    },
    changePassword: {
      titleStudent: 'Öğrenci Şifresini Sıfırla',
      descriptionStudent: 'Bu öğrenciye şifre sıfırlama e-postası gönderin.',
      confirmMessageStudent:
        '{{email}} adresine şifre sıfırlama e-postası gönderilecektir. Öğrenci yeni şifre oluşturmak için talimatları alacaktır.',
      titleTeacher: 'Öğretmen Şifresini Sıfırla',
      descriptionTeacher: 'Bu öğretmene şifre sıfırlama e-postası gönderin.',
      confirmMessageTeacher:
        '{{email}} adresine şifre sıfırlama e-postası gönderilecektir. Öğretmen yeni şifre oluşturmak için talimatları alacaktır.',
      titleParent: 'Veli Şifresini Sıfırla',
      descriptionParent: 'Bu veliye şifre sıfırlama e-postası gönderin.',
      confirmMessageParent:
        '{{email}} adresine şifre sıfırlama e-postası gönderilecektir. Veli yeni şifre oluşturmak için talimatları alacaktır.',
      titleUser: 'Kullanıcı Şifresini Sıfırla',
      descriptionUser: 'Bu kullanıcıya şifre sıfırlama e-postası gönderin.',
      confirmMessageUser:
        '{{email}} adresine şifre sıfırlama e-postası gönderilecektir. Kullanıcı yeni şifre oluşturmak için talimatları alacaktır.',
      warningTitle: 'Bilgi',
      warningDescriptionStudent:
        'Öğrenci şifresini sıfırlamak için güvenli bir bağlantı içeren e-posta alacaktır. Bağlantı 7 gün sonra geçerliliğini yitirecektir.',
      warningDescriptionTeacher:
        'Öğretmen şifresini sıfırlamak için güvenli bir bağlantı içeren e-posta alacaktır. Bağlantı 7 gün sonra geçerliliğini yitirecektir.',
      warningDescriptionParent:
        'Veli şifresini sıfırlamak için güvenli bir bağlantı içeren e-posta alacaktır. Bağlantı 7 gün sonra geçerliliğini yitirecektir.',
      warningDescriptionUser:
        'Kullanıcı şifresini sıfırlamak için güvenli bir bağlantı içeren e-posta alacaktır. Bağlantı 7 gün sonra geçerliliğini yitirecektir.',
      confirmButtonText: 'Sıfırlama E-postası Gönder',
      cancel: 'İptal',
      successMessage: 'Şifre sıfırlama e-postası başarıyla gönderildi',
      errorMessage: 'Şifre sıfırlama e-postası gönderilemedi',
    },
    resendInvitation: {
      title: 'Daveti Yeniden Gönder',
      description: 'Bu öğrenciye davet e-postasını yeniden gönderin.',
      warningTitle: 'Bilgi',
      warningDescription:
        'Öğrenci hesap oluşturma işlemini tamamlamak için güvenli bir bağlantı içeren e-posta alacaktır. Bağlantı 7 gün sonra geçerliliğini yitirecektir.',
      confirmMessage:
        '{{email}} adresine davet e-postası gönderilecektir. Öğrenci hesap oluşturma işlemini tamamlamak için talimatları alacaktır.',
      confirmButtonText: 'Daveti Yeniden Gönder',
      cancel: 'İptal',
      successMessage: 'Davet e-postası başarıyla gönderildi',
      errorMessage: 'Davet e-postası gönderilemedi',
    },
    action: {
      success: {
        createStudent: 'Öğrenci başarıyla oluşturuldu.',
        updateStudent: 'Öğrenci başarıyla güncellendi.',
        importStudent: 'Öğrenciler başarıyla içe aktarıldı.',
        createTeacher: 'Öğretmen başarıyla oluşturuldu.',
        updateTeacher: 'Öğretmen başarıyla güncellendi.',
        importTeacher: 'Öğretmenler başarıyla içe aktarıldı.',
        createParent: 'Veli başarıyla oluşturuldu.',
        updateParent: 'Veli başarıyla güncellendi.',
        importParent: 'Veliler başarıyla içe aktarıldı.',
        createUser: 'Kullanıcı başarıyla oluşturuldu.',
        updateUser: 'Kullanıcı başarıyla güncellendi.',
        importUser: 'Kullanıcılar başarıyla içe aktarıldı.',
      },
      error: {
        createStudent: 'Öğrenci oluşturulamadı.',
        updateStudent: 'Öğrenci güncellenemedi.',
        importStudent: 'Öğrenciler içe aktarılamadı.',
        createTeacher: 'Öğretmen oluşturulamadı.',
        updateTeacher: 'Öğretmen güncellenemedi.',
        importTeacher: 'Öğretmenler içe aktarılamadı.',
        createParent: 'Veli oluşturulamadı.',
        updateParent: 'Veli güncellenemedi.',
        importParent: 'Veliler içe aktarılamadı.',
        createUser: 'Kullanıcı oluşturulamadı.',
        updateUser: 'Kullanıcı güncellenemedi.',
        importUser: 'Kullanıcılar içe aktarılamadı.',
      },
      addTitleStudent: 'Yeni Öğrenci Ekle',
      editTitleStudent: 'Öğrenciyi Düzenle',
      addDescriptionStudent:
        "Yeni öğrenciyi burada oluşturun. İşiniz bittiğinde kaydet'e tıklayın.",
      editDescriptionStudent:
        "Öğrenciyi burada güncelleyin. İşiniz bittiğinde kaydet'e tıklayın.",
      addTitleTeacher: 'Yeni Öğretmen Ekle',
      editTitleTeacher: 'Öğretmeni Düzenle',
      addDescriptionTeacher:
        "Yeni öğretmene burada oluşturun. İşiniz bittiğinde kaydet'e tıklayın.",
      editDescriptionTeacher:
        "Öğretmeni burada güncelleyin. İşiniz bittiğinde kaydet'e tıklayın.",
      addTitleParent: 'Yeni Veli Ekle',
      editTitleParent: 'Veliyi Düzenle',
      addDescriptionParent:
        "Yeni veliyi burada oluşturun. İşiniz bittiğinde kaydet'e tıklayın.",
      editDescriptionParent:
        "Veliyi burada güncelleyin. İşiniz bittiğinde kaydet'e tıklayın.",
      addTitleUser: 'Yeni Kullanıcı Ekle',
      editTitleUser: 'Kullanıcıyı Düzenle',
      addDescriptionUser:
        "Yeni kullanıcıyı burada oluşturun. İşiniz bittiğinde kaydet'e tıklayın.",
      editDescriptionUser:
        "Kullanıcıyı burada güncelleyin. İşiniz bittiğinde kaydet'e tıklayın.",
      form: {
        saveChanges: 'Değişiklikleri kaydet',
        create: 'Oluştur',
        update: 'Güncelle',
      },
      placeholders: {
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        username: 'ahmet_yilmaz',
        email: 'ahmet.yilmaz@gmail.com',
        phoneNumber: '+905551234567',
        nationalId: 'T.C. Kimlik No',
        country: 'Ülke',
        city: 'Şehir',
        state: 'Eyalet',
        address: 'Adres',
        zipCode: 'Posta Kodu',
        facebookLink: 'https://facebook.com/kullaniciadi',
        twitterLink: 'https://x.com/kullaniciadi',
        instagramLink: 'https://instagram.com/kullaniciadi',
        linkedinLink: 'https://linkedin.com/in/kullaniciadi',
      },
    },
    view: {
      title: '{{entity}} Detayları',
      description: 'Bu kişinin detaylı bilgilerini görüntüleyin.',
      sections: {
        basicInformation: 'Temel Bilgiler',
        personalInformation: 'Kişisel Bilgiler',
        contactInformation: 'İletişim Bilgileri',
        socialLinks: 'Sosyal Medya Bağlantıları',
        accountInformation: 'Hesap Bilgileri',
        statistics: 'İstatistikler',
        systemInformation: 'Sistem Bilgileri',
      },
      fields: {
        about: 'Hakkında',
        fullName: 'Ad Soyad',
        email: 'E-posta',
        phoneNumber: 'Telefon Numarası',
        nationalId: 'T.C. Kimlik No',
        gender: 'Cinsiyet',
        dateOfBirth: 'Doğum Tarihi',
        country: 'Ülke',
        city: 'Şehir',
        state: 'Eyalet',
        address: 'Adres',
        zipCode: 'Posta Kodu',
        profilePicture: 'Profil Fotoğrafı',
        facebookLink: 'Facebook',
        twitterLink: 'X (Twitter)',
        instagramLink: 'Instagram',
        linkedinLink: 'LinkedIn',
        status: 'Statü',
        createdAt: 'Oluşturulma Tarihi',
        lastUpdatedAt: 'Son Güncellenme Tarihi',
        statusUpdatedAt: 'Statü Güncellenme Tarihi',
        statusUpdateReason: 'Statü Güncellenme Nedeni',
      },
      close: 'Kapat',
    },
  },
  commandMenu: {
    placeholder: 'Komut yazın veya arayın...',
    noResults: 'Sonuç bulunamadı.',
    theme: 'Tema',
    light: 'Açık',
    dark: 'Koyu',
    system: 'Sistem',
  },
  dataTable: {
    noResults: 'Sonuç bulunamadı.',
    selectAll: 'Tümünü seç',
    selectRow: 'Satırı seç',
  },
  table: {
    sort: {
      asc: 'Artan',
      desc: 'Azalan',
    },
    actions: {
      hide: 'Gizle',
      view: 'Görünüm',
      clearFilters: 'Filtreleri temizle',
      resetSort: 'Sıralamayı sıfırla',
    },
    filters: {
      noResults: 'Sonuç bulunamadı.',
      selectedCount: '{{count}} seçildi',
    },
    pagination: {
      rowsPerPage: 'Sayfa başına satır',
      pageXofY: 'Sayfa {{page}} / {{total}}',
      goToFirstPage: 'İlk sayfaya git',
      goToPreviousPage: 'Önceki sayfaya git',
      goToNextPage: 'Sonraki sayfaya git',
      goToLastPage: 'Son sayfaya git',
      selectedOfTotal: '{{total}} satırdan {{selected}} seçildi.',
    },
    view: {
      toggleColumns: 'Sütunları değiştir',
    },
  },

  sidebar: {
    teams: {
      shadcnAdmin: 'Shadcn Admin',
      acmeInc: 'Acme Inc',
      acmeCorp: 'Acme Corp.',
    },
    navGroups: {
      academySection: 'Akademi Bölümü',
      managementSection: 'Yönetim Bölümü',
      superManagementSection: 'Süper Yönetim Bölümü',
      supportSection: 'Destek Bölümü',
      general: 'Genel',
      pages: 'Sayfalar',
      other: 'Diğer',
    },
    navigation: {
      dashboard: 'Anasayfa',
      tasks: 'Görevler',
      apps: 'Uygulamalar',
      chats: 'Sohbetler',
      users: 'Kullanıcılar',
      usersAndRoles: 'Kullanıcılar ve Roller',
      modules: 'Modüller',
      branchSettings: 'Şube Ayarları',
      // super management section
      companiesAndBranches: 'Şirketler ve Şubeler',
      companies: 'Şirketler',
      branches: 'Şubeler',
      students: 'Öğrenciler',
      teachers: 'Öğretmenler',
      parents: 'Veliler',
      classrooms: 'Sınıflar',
      attendance: 'Katılım',
      subjectsCurriculums: 'Konular & Müfredatlar',
      questionBank: 'Soru Bankası',
      assessments: 'Değerlendirmeler',
      materials: 'Materyaller',
      securedByClerk: 'Clerk ile Güvenli',
      auth: 'Kimlik Doğrulama',
      login: 'Giriş Yap',
      loginTwoCol: 'Giriş Yap (2 Sütun)',
      signUp: 'Kayıt Ol',
      forgotPassword: 'Şifremi Unuttum',
      otp: 'OTP',
      errors: 'Hatalar',
      unauthorized: 'Yetkisiz',
      forbidden: 'Yasak',
      notFound: 'Bulunamadı',
      internalServerError: 'Sunucu Hatası',
      maintenanceError: 'Bakım Hatası',
      settings: 'Ayarlar',
      profile: 'Profil',
      inventory: 'Envanter',
      security: 'Güvenlik',
      preferences: 'Tercihler',
      helpCenter: 'Yardım Merkezi',
    },
  },

  fileDroppableArea: {
    dragAndDropText: 'Dosya yüklemek için sürükleyip bırakın veya',
    browseFromDisk: 'Diskten seçin',
    selectedFile: 'Seçilen dosya',
  },
  countrySelector: {
    selectCountry: 'Ülke seçin',
    searchCountries: 'Ülke ara...',
    noCountriesFound: 'Ülke bulunamadı',
  },
  citySelector: {
    selectCity: 'Şehir seçin',
    searchCities: 'Şehir ara...',
    noCitiesFound: 'Şehir bulunamadı',
    enterCity: 'Şehir adını girin',
  },
  phoneInput: {
    selectCountry: 'Ülke seçin',
    searchCountries: 'Ülke, kod veya telefon koduna göre ara...',
    noCountriesFound: 'Ülke bulunamadı',
    enterPhoneNumber: 'Telefon numarası girin',
  },
  multiSelect: {
    selectOptions: 'Seçenekleri seçin',
    searchOptions: 'Seçenekleri ara...',
    noResults: 'Sonuç bulunamadı.',
    selectAll: 'Tümünü Seç',
    clear: 'Temizle',
    close: 'Kapat',
    selectedCount: '{{count}} seçildi',
    moreSelected: '+ {{count}} daha',
    // Accessibility messages
    multiSelectDropdown:
      'Çoklu seçim açılır menüsü. Gezinmek için ok tuşlarını, seçmek için Enter ve kapatmak için Escape tuşunu kullanın.',
    noOptionsSelected: 'Hiçbir seçenek seçilmedi',
    optionSelected: '{{count}} seçenek seçildi: {{options}}',
    optionSelectedSingle:
      '{{option}} seçildi. {{total}} seçenekten {{selected}} tanesi seçildi.',
    optionsSelectedMultiple:
      '{{count}} seçenek seçildi. Toplam {{total}} seçenekten {{selected}} tanesi seçildi.',
    optionRemoved:
      'Seçenek kaldırıldı. {{total}} seçenekten {{selected}} tanesi seçildi.',
    dropdownOpened:
      'Açılır menü açıldı. {{total}} seçenek mevcut. Gezinmek için ok tuşlarını kullanın.',
    dropdownClosed: 'Açılır menü kapatıldı.',
    searchResults: '"{{query}}" için {{count}} seçenek bulundu',
    removeFromSelection: '{{option}} seçimden kaldır',
    clearAllSelected: 'Seçili {{count}} seçeneğin tümünü temizle',
    selectAllOptions: '{{count}} seçeneğin tümünü seç',
    searchHelp:
      'Seçenekleri filtrelemek için yazın. Sonuçlarda gezinmek için ok tuşlarını kullanın.',
  },
  errors: {
    maintenance: {
      title: 'Web sitesi bakımda!',
      description: 'Site şu anda mevcut değil.',
      subtitle: 'Kısa süre içinde tekrar çevrimiçi olacağız.',
      learnMore: 'Daha fazla bilgi',
    },
    notFound: {
      title: 'Hay aksi! Sayfa Bulunamadı!',
      description: 'Aradığınız sayfa',
      subtitle: 'mevcut değil veya kaldırılmış olabilir.',
      goBack: 'Geri Dön',
      backToHome: 'Ana Sayfaya Dön',
    },
    unauthorized: {
      title: 'Yetkisiz Erişim',
      description: 'Bu kaynağa erişmek için',
      subtitle: 'uygun kimlik bilgileriyle giriş yapınız.',
      goBack: 'Geri Dön',
      backToHome: 'Ana Sayfaya Dön',
    },
    general: {
      title: "Hay aksi! Bir şeyler yanlış gitti :'(",
      description: 'Verdiğimiz rahatsızlıktan dolayı özür dileriz.',
      subtitle: 'Lütfen daha sonra tekrar deneyin.',
      goBack: 'Geri Dön',
      backToHome: 'Ana Sayfaya Dön',
    },
    forbidden: {
      title: 'Erişim Yasak',
      description: 'Bu kaynağı görüntülemek için',
      subtitle: 'gerekli izniniz yok.',
      goBack: 'Geri Dön',
      backToHome: 'Ana Sayfaya Dön',
    },
  },
};
