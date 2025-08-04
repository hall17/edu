export const roles = {
  title: 'Rol Yönetimi',
  description: 'Kullanıcı rollerini ve yetkilerini yönetin',
  createTitle: 'Rol Oluştur',
  createDescription: 'Belirli yetkilerle yeni rol oluşturun',
  editTitle: 'Rol Düzenle',
  editDescription: 'Rol bilgilerini ve yetkilerini güncelleyin',
  viewTitle: 'Rolü Görüntüle',
  viewDescription: 'Rol detaylarını ve bilgilerini görüntüleyin',
  noRoles: 'Rol bulunamadı',
  buttons: {
    addRole: 'Rol Ekle',
    create: 'Rol Oluştur',
    update: 'Rol Güncelle',
    managePermissions: 'Yetkileri Yönet',
  },
  tabs: {
    general: 'Genel',
    permissions: 'Yetkiler',
  },
  permissions: {
    name: 'Yetki',
    permission: 'Yetki',
    access: 'Erişim',
    fullAccess: 'Tam Erişim',
    noModulesAvailable: 'Kullanılabilir modül yok',
    title: 'Yetki Yönetimi',
    description:
      'Bu rol için her modül anahtarını açıp kapatarak yetkileri yönetin',
    types: {
      read: 'Verileri görüntüle ve eriş',
      write: 'Veri oluştur ve değiştir',
      delete: 'Verileri kalıcı olarak sil',
    },
    messages: {
      assignSuccess: 'Yetki başarıyla atandı',
      assignError: 'Yetki atanamadı',
      removeSuccess: 'Yetki başarıyla kaldırıldı',
      removeError: 'Yetki kaldırılamadı',
    },
  },
  table: {
    filterPlaceholder: 'Rolleri filtrele...',
    columns: {
      isSystem: 'Tür',
    },
    filters: {
      status: 'Statü',
      type: 'Tür',
    },
    actions: {
      view: 'Görüntüle',
      edit: 'Düzenle',
      suspend: 'Askıya Al',
      activate: 'Etkinleştir',
      delete: 'Sil',
      cannotDeleteSystemRole: 'Sistem rolleri silinemez',
      cannotSuspendSystemRole: 'Sistem rolleri askıya alınamaz',
    },
    statusChangeWarning:
      'Durum değişikliği rolün kullanılabilirliğini ve ilgili aktiviteleri etkileyecektir.',
  },
  updateStatusSuccess: 'Rol durumu başarıyla güncellendi',
  updateStatusError: 'Rol durumu güncellenemedi',
  form: {
    active: 'Aktif',
    code: 'Kod',
    name: 'Ad',
    description: 'Açıklama',
    status: 'Statü',
    visible: 'Görünür',
    systemRoleTooltip:
      'Sistem rolleri sistem işlevselliği için gerekli olduğundan değiştirilemez veya devre dışı bırakılamaz.',
    permissionsCreateNote:
      'Rolü oluşturduktan sonra izinleri yapılandırabilirsiniz. Önce rolü kaydedin, ardından izinleri ayarlamak için düzenleyin.',
    placeholders: {
      code: 'Rol kodunu girin',
      name: 'Rol adını girin',
      description: 'Rol açıklamasını girin',
      status: 'Statü seçin',
    },
  },
  status: {
    active: 'Aktif',
    inactive: 'Pasif',
  },
  messages: {
    createSuccess: 'Rol başarıyla oluşturuldu',
    createError: 'Rol oluşturulamadı',
    updateSuccess: 'Rol başarıyla güncellendi',
    updateError: 'Rol güncellenemedi',
    deleteSuccess: 'Rol başarıyla silindi',
    deleteError: 'Rol silinemedi',
  },
  deleteDialog: {
    title: 'Rolü Sil',
    description:
      'Bu rolü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    warningTitle: 'Uyarı',
    warningDescription:
      '"{{name}}" rolünü silmek onu tüm kullanıcılardan kaldıracaktır. Silmeden önce hiçbir kullanıcının bu role atanmadığından emin olun.',
  },
  viewDialog: {
    basicInfo: 'Temel Bilgiler',
    roleType: 'Rol Türü',
    systemRole: 'Sistem Rolü',
    customRole: 'Özel Rol',
  },
  suspendDialog: {
    suspendTitle: 'Rolü Askıya Al',
    activateTitle: 'Rolü Etkinleştir',
    suspendDescription:
      'Bu rolü geçici olarak kullanımını kısıtlamak için askıya alın.',
    activateDescription:
      'Bu rolün işlevselliğini geri yüklemek için etkinleştirin.',
    confirmMessage:
      'askıya alınacak ve atama için kullanılamayacak. Devam etmek istediğinizden emin misiniz?',
    suspendedMessage:
      'yeniden etkinleştirilecek ve atama için kullanılabilir olacak. Devam etmek istediğinizden emin misiniz?',
    warningTitle: 'Uyarı!',
    warningDescription:
      'Bu işlem rol durumunu değiştirecektir. Bu işlemi daha sonra geri alabilirsiniz.',
    statusUpdateReasonLabel: 'Askıya alma nedeni',
    statusUpdateReasonPlaceholder:
      'Lütfen bu rolü askıya alma nedeninizi belirtin...',
    statusUpdateReasonRequired: 'Askıya alma nedeni gereklidir',
    suspendButtonText: 'Askıya Al',
    activateButtonText: 'Etkinleştir',
    cancel: 'İptal',
    successMessage: 'Rol durumu başarıyla güncellendi',
    errorMessage: 'Rol durumu güncellenemedi. Lütfen tekrar deneyin.',
  },
  statusDialog: {
    title: 'Rol Durumunu Değiştir',
    description: '{{name}} için durumu değiştirin.',
    currentStatus: 'Mevcut Durum',
    newStatus: 'Yeni Durum',
    updateButton: 'Durumu Güncelle',
    success: 'Rol durumu başarıyla güncellendi',
  },
};
