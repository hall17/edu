export const teachers = {
  title: 'Öğretmen Listesi',
  description: 'Öğretmenlerinizi ve bilgilerini burada yönetin.',
  buttons: {
    inviteTeacher: 'Davet Et',
    addTeacher: 'Öğretmen Ekle',
  },
  table: {
    filterPlaceholder: 'Öğretmenleri filtrele...',
    noResults: 'Sonuç bulunamadı.',
    statusChangeWarning:
      'Durum değişikliği öğretmenin sisteme erişimini ve ilgili aktiviteleri etkileyecektir.',
    columns: {
      name: 'Ad',
      email: 'E-posta',
      phoneNumber: 'Telefon Numarası',
      status: 'Statü',
      type: 'Tür',
    },
    filters: {
      status: 'Statü',
      type: 'Tür',
      reset: 'Sıfırla',
    },
    statusOptions: {
      active: 'Aktif',
      inactive: 'Pasif',
      'on-leave': 'İzinli',
      retired: 'Emekli',
    },
    actions: {
      openMenu: 'Menüyü aç',
      view: 'Görüntüle',
      edit: 'Düzenle',
      suspend: 'Askıya Al',
      resetPassword: 'Şifre Sıfırla',
      delete: 'Sil',
    },
  },
  updateStatusSuccess: 'Öğretmen durumu başarıyla güncellendi',
  updateStatusError: 'Öğretmen durumu güncellenemedi',
  actionDialog: {
    createSuccessMessage: 'Öğretmen başarıyla oluşturuldu.',
    updateSuccessMessage: 'Öğretmen başarıyla güncellendi.',
    errorMessage: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    addTitle: 'Yeni Öğretmen Ekle',
    editTitle: 'Öğretmeni Düzenle',
    addDescription:
      "Yeni öğretmen oluşturun. Bitirdiğinizde kaydet'e tıklayın.",
    editDescription: "Öğretmeni güncelleyin. Bitirdiğinizde kaydet'e tıklayın.",
    tabs: {
      basic: 'Temel Bilgiler',
      additional: 'Ek Bilgiler',
    },
    form: {
      firstName: 'Ad',
      lastName: 'Soyad',
      username: 'Kullanıcı Adı',
      email: 'E-posta',
      phoneNumber: 'Telefon Numarası',
      type: 'Tür',
      selectType: 'Bir tür seçin',
      gender: 'Cinsiyet',
      selectGender: 'Cinsiyet seçin',
      dateOfBirth: 'Doğum Tarihi',
      selectDate: 'Tarih seçin',
      address: 'Adres',
      bio: 'Biyografi',
      update: 'Güncelle',
    },
  },
  inviteDialog: {
    description:
      'Yeni öğretmeni kurumunuza katılmaya davet etmek için e-posta daveti gönderin. İstihdam statüsünu tanımlamak için bir tür atayın.',
  },
  statusDialog: {
    title: 'Öğretmen Durumunu Değiştir',
    description: '{{name}} için durumu değiştirin.',
    currentStatus: 'Mevcut Durum',
    newStatus: 'Yeni Durum',
    updateButton: 'Durumu Güncelle',
    success: 'Öğretmen durumu başarıyla güncellendi',
  },
};
