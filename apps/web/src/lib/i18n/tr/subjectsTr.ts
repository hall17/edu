export const subjects = {
  title: 'Konular',
  description: 'Konularınızı ve bilgilerini burada yönetin.',
  buttons: {
    addSubject: 'Konu Ekle',
  },
  table: {
    filterPlaceholder: 'Konuları filtrele...',
    noResults: 'Sonuç bulunamadı.',
    name: 'Ad',
    branch: 'Şube',
    curriculums: 'Müfredatlar',
    curriculum: 'müfredat',
    curriculumsCount: '{{count}} müfredat',
    createdAt: 'Oluşturulma Tarihi',
    statusChangeWarning:
      'Durum değişikliği konunun kullanılabilirliğini ve ilgili aktiviteleri etkileyecektir.',
    actions: {
      view: 'Görüntüle',
      edit: 'Düzenle',
      suspend: 'Askıya Al',
      activate: 'Aktifleştir',
      delete: 'Sil',
    },
  },
  updateStatusSuccess: 'Konu durumu başarıyla güncellendi',
  updateStatusError: 'Konu durumu güncellenemedi',
  actionDialog: {
    createTitle: 'Yeni Konu Oluştur',
    editTitle: 'Konuyu Düzenle',
    createDescription:
      "Yeni konuyu burada oluşturun. İşiniz bittiğinde kaydet'e tıklayın.",
    editDescription:
      "Konuyu burada güncelleyin. İşiniz bittiğinde kaydet'e tıklayın.",
    tabs: {
      basic: 'Temel Bilgiler',
      curriculum: 'Müfredat',
    },
    createSuccess: 'Konu başarıyla oluşturuldu',
    updateSuccess: 'Konu başarıyla güncellendi',
    createError: 'Konu oluşturulamadı',
    updateError: 'Konu güncellenemedi',
    addCurriculum: 'Müfredat Ekle',
    addLesson: 'Ders Ekle',
    lessons: 'Dersler',
    lessonsCount: '{{count}} ders',
  },
  viewDialog: {
    description: 'Bu konu hakkında detaylı bilgi görüntüleyin.',
    basicInfo: 'Temel Bilgiler',
    curriculums: 'Müfredatlar',
    createdAt: '{{date}} tarihinde oluşturuldu',
    lessons: 'ders',
    statistics: 'İstatistikler',
    totalCurriculums: 'Toplam Müfredat',
    totalLessons: 'Toplam Ders',
    createdYear: 'Oluşturulma Yılı',
    noCurriculums: 'Bu konu için müfredat bulunamadı.',
  },
  deleteDialog: {
    title: 'Konuyu Sil',
    description:
      '"{{name}}" konu kalıcı olarak silinecektir. Bu işlem geri alınamaz.',
    warning: 'Bu konu {{count}} müfredata sahip, bunlar da silinecektir.',
    deleteSuccess: 'Konu başarıyla silindi',
    deleteError: 'Konu silinemedi',
  },
  suspendDialog: {
    title: 'Konuyu Askıya Al',
    suspendTitle: 'Konuyu Askıya Al',
    activateTitle: 'Konuyu Aktifleştir',
    description:
      'Bu konu hesabını askıya alarak geçici olarak erişimi kısıtlayın.',
    suspendDescription:
      'Bu konu hesabını askıya alarak geçici olarak erişimi kısıtlayın.',
    activateDescription:
      'Bu konu hesabını aktifleştirerek sisteme erişimi geri yükleyin.',
    confirmMessage:
      'Konu askıya alınacak ve yeni müfredatlarda kullanılamayacaktır. Devam etmek istediğinizden emin misiniz?',
    suspendedMessage:
      'Konu yeniden aktifleştirilecek ve sisteme erişimi geri kazanacaktır. Devam etmek istediğinizden emin misiniz?',
    warningTitle: 'Uyarı!',
    warningDescription:
      'Bu işlem konunun statüsünü değiştirecektir. Bu işlemi daha sonra geri alabilirsiniz.',
    statusUpdateReasonLabel: 'Askıya alınma nedeni',
    statusUpdateReasonPlaceholder:
      'Bu konuyu askıya alma nedeninizi belirtin...',
    statusUpdateReasonRequired: 'Askıya alınma nedeni zorunludur',
    confirmButtonText: 'Askıya Al',
    suspendButtonText: 'Askıya Al',
    activateButtonText: 'Aktifleştir',
    cancel: 'İptal',
    successMessage: 'Konu statüsü başarıyla güncellendi',
    errorMessage:
      'Konu statüsü güncellenirken hata oluştu. Lütfen tekrar deneyin.',
  },
  statusDialog: {
    title: 'Konu Durumunu Değiştir',
    description: '{{name}} için durumu değiştirin.',
    currentStatus: 'Mevcut Durum',
    newStatus: 'Yeni Durum',
    updateButton: 'Durumu Güncelle',
    success: 'Konu durumu başarıyla güncellendi',
  },
};
