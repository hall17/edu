export const users = {
  title: 'Kullanıcılar & Roller',
  description: 'Kullanıcılarınızı ve rollerinizi burada yönetin.',
  tabs: {
    users: 'Kullanıcılar',
    roles: 'Roller',
  },
  buttons: {
    inviteUser: 'Kullanıcı Davet Et',
    addUser: 'Kullanıcı Ekle',
    manageRoles: 'Rolleri Yönet',
  },
  table: {
    filterPlaceholder: 'Kullanıcıları filtrele...',
    noResults: 'Sonuç bulunamadı.',
    statusChangeWarning:
      'Durum değişikliği kullanıcının sisteme erişimini ve ilgili aktiviteleri etkileyecektir.',
    columns: {
      name: 'Ad',
      email: 'E-posta',
      phoneNumber: 'Telefon Numarası',
      status: 'Statü',
      role: 'Rol',
    },
    filters: {
      status: 'Statü',
      role: 'Rol',
      reset: 'Sıfırla',
    },
    actions: {
      openMenu: 'Menüyü aç',
      view: 'Görüntüle',
      edit: 'Düzenle',
      suspend: 'Askıya Al',
      activate: 'Aktifleştir',
      changePassword: 'Şifreyi Değiştir',
      delete: 'Sil',
    },
  },
  updateStatusSuccess: 'Kullanıcı durumu başarıyla güncellendi',
  updateStatusError: 'Kullanıcı durumu güncellenemedi',
  inviteDialog: {
    description:
      'Yeni kullanıcıyı ekibinize katılmaya davet etmek için e-posta daveti gönderin. Erişim seviyesini tanımlamak için bir rol atayın.',
    form: {
      roles: 'Roller',
    },
    placeholders: {
      roles: 'Roller seçin',
    },
  },
  statusDialog: {
    title: 'Kullanıcı Durumunu Değiştir',
    description: '{{name}} için durumu değiştirin.',
    currentStatus: 'Mevcut Durum',
    newStatus: 'Yeni Durum',
    updateButton: 'Durumu Güncelle',
    success: 'Kullanıcı durumu başarıyla güncellendi',
  },
};
