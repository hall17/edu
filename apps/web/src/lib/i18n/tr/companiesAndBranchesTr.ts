export const companiesAndBranches = {
  title: 'Şirketler ve Şubeler',
  description: 'Sistem genelindeki şirketleri ve şubeleri yönetin.',
  tabs: {
    companies: 'Şirketler',
    branches: 'Şubeler',
  },
  buttons: {
    addCompany: 'Şirket Ekle',
    addBranch: 'Şube Ekle',
  },
  companies: {
    title: 'Şirketler',
    description: 'Sistemdeki tüm şirketleri yönetin.',
    table: {
      filterPlaceholder: 'Şirketleri filtrele...',
      noResults: 'Şirket bulunamadı.',
      columns: {
        name: 'Ad',
        slug: 'Kısa Ad',
        branches: 'Şubeler',
        classrooms: 'Sınıflar',
        students: 'Öğrenciler',
        status: 'Statü',
      },
      filters: {
        status: 'Statü',
        reset: 'Sıfırla',
      },
      actions: {
        openMenu: 'Menüyü aç',
        addBranch: 'Şube Ekle',
        view: 'Görüntüle',
        edit: 'Düzenle',
        delete: 'Sil',
      },
    },
    suspendDialog: {
      suspendTitle: 'Şirketi Askıya Al',
      activateTitle: 'Şirketi Aktifleştir',
      suspendDescription:
        'Bu şirketi askıya alarak geçici olarak erişimi kısıtlayın.',
      activateDescription:
        'Bu şirketi aktifleştirerek sisteme erişimi geri yükleyin.',
      confirmMessage:
        'askıya alınacak ve kullanıcılar tarafından erişilemeyecektir. Devam etmek istediğinizden emin misiniz?',
      suspendedMessage:
        'yeniden aktifleştirilecek ve sisteme erişimi geri kazanacaktır. Devam etmek istediğinizden emin misiniz?',
      warningTitle: 'Uyarı!',
      warningDescription:
        'Bu işlem şirket durumunu değiştirecektir. Bu işlemi daha sonra geri alabilirsiniz.',
      warningDescriptionWithBranches:
        'Bu işlem şirket durumunu değiştirecek ve bu şirketle ilişkili {{count}} şube de askıya alınacaktır. Bu işlemi daha sonra geri alabilirsiniz.',
      statusUpdateReasonLabel: 'Askıya alınma nedeni',
      statusUpdateReasonPlaceholder:
        'Bu şirketi askıya alma nedeninizi belirtin...',
      statusUpdateReasonRequired: 'Askıya alınma nedeni zorunludur',
      suspendButtonText: 'Askıya Al',
      activateButtonText: 'Aktifleştir',
      cancel: 'İptal',
      successMessage: 'Şirket durumu başarıyla güncellendi',
      errorMessage:
        'Şirket durumu güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
    },
    viewDialog: {
      title: 'Şirketi Görüntüle',
      description: 'Şirket detaylarını ve bilgilerini görüntüleyin.',
    },
    actionDialog: {
      addTitle: 'Şirket Ekle',
      addDescription: 'Yeni şirket oluşturun.',
      editTitle: 'Şirketi Düzenle',
      editDescription: 'Şirket bilgilerini güncelleyin.',
      createSuccess: 'Şirket başarıyla oluşturuldu.',
      createError: 'Şirket oluşturulamadı.',
      updateSuccess: 'Şirket başarıyla güncellendi.',
      updateError: 'Şirket güncellenirken bir hata oluştu.',
      form: {
        name: 'Ad',
        slug: 'Kısa Ad',
        websiteUrl: 'Web Sitesi URL',
        maximumBranches: 'Maksimum Şube Sayısı',
        location: 'Konum',
        contact: 'İletişim',
        company: 'Şirket',
        status: 'Statü',
        selectCompany: 'Şirket seçin',
        selectStatus: 'Statü seçin',
      },
    },
    deleteDialog: {
      title: 'Şirketi Sil',
      description: 'Bu şirketi sistemden silin.',
      confirmMessage:
        'Şirket "{{name}}" sistemden kalıcı olarak kaldırılacaktır. Devam etmek istediğinizden emin misiniz?',
      warningWithBranches:
        'Bu şirketle ilişkili {{count}} şube de silinecektir.',
      warning: 'Bu işlem geri alınamaz.',
      deleteButtonText: 'Şirketi Sil',
      successMessage: 'Şirket başarıyla silindi.',
      errorMessage: 'Şirket silinirken bir hata oluştu.',
    },
  },
  branches: {
    title: 'Şubeler',
    description: 'Sistemdeki tüm şubeleri yönetin.',
    table: {
      filterPlaceholder: 'Şubeleri filtrele...',
      noResults: 'Şube bulunamadı.',
      columns: {
        name: 'Ad',
        slug: 'Kısa Ad',
        location: 'Konum',
        contact: 'İletişim',
        company: 'Şirket',
        status: 'Statü',
        modules: 'Modüller',
        students: 'Öğrenciler',
        parents: 'Veli',
        roles: 'Roller',
        users: 'Kullanıcılar',
      },
      filters: {
        status: 'Statü',
        reset: 'Sıfırla',
      },
      actions: {
        openMenu: 'Menüyü aç',
        view: 'Görüntüle',
        edit: 'Düzenle',
        delete: 'Sil',
      },
    },
    actionDialog: {
      addTitle: 'Şube Ekle',
      addDescription: 'Yeni şube oluşturun.',
      editTitle: 'Şubeyi Düzenle',
      editDescription: 'Şube bilgilerini güncelleyin.',
      description: 'Şube bilgilerini yönetin.',
      createSuccess: 'Şube başarıyla oluşturuldu.',
      createError: 'Şube oluşturulamadı.',
      updateSuccess: 'Şube başarıyla güncellendi.',
      updateError: 'Şube güncellenirken bir hata oluştu.',
      form: {
        name: 'Ad',
        slug: 'Kısa Ad',
        location: 'Konum',
        contact: 'İletişim',
        canBeDeleted: 'Silinebilir',
        maximumStudents: 'Maksimum Öğrenci Sayısı',
        company: 'Şirket',
        status: 'Statü',
        selectCompany: 'Şirket seçin',
        selectStatus: 'Statü seçin',
        selectCanBeDeleted: 'Seçenek seçin',
      },
    },
    deleteDialog: {
      title: 'Şubeyi Sil',
      description: 'Bu şubeyi sistemden silin.',
      confirmMessage:
        '"{{name}}" şubesi sistemden kalıcı olarak kaldırılacaktır. Devam etmek istediğinizden emin misiniz?',
      warning: 'Bu işlem geri alınamaz.',
      deleteButtonText: 'Şubeyi Sil',
      successMessage: 'Şube başarıyla silindi.',
      errorMessage: 'Şube silinirken bir hata oluştu.',
    },
    suspendDialog: {
      suspendTitle: 'Şubeyi Askıya Al',
      activateTitle: 'Şubeyi Aktifleştir',
      suspendDescription:
        'Bu şubeyi askıya alarak geçici olarak erişimi kısıtlayın.',
      activateDescription:
        'Bu şubeyi aktifleştirerek sisteme erişimi geri yükleyin.',
      warningTitle: 'Uyarı!',
      warningDescription:
        'Bu işlem şube durumunu değiştirecektir. Bu işlemi daha sonra geri alabilirsiniz.',
      statusUpdateReasonLabel: 'Askıya alınma nedeni',
      statusUpdateReasonPlaceholder:
        'Bu şubeyi askıya alma nedeninizi belirtin...',
      statusUpdateReasonRequired: 'Askıya alınma nedeni zorunludur',
      suspendButtonText: 'Askıya Al',
      activateButtonText: 'Aktifleştir',
      cancel: 'İptal',
      confirmMessage:
        'askıya alınacak ve kullanıcılar tarafından erişilemeyecektir. Devam etmek istediğinizden emin misiniz?',
      suspendedMessage:
        'yeniden aktifleştirilecek ve sisteme erişimi geri kazanacaktır. Devam etmek istediğinizden emin misiniz?',
      successMessage: 'Şube durumu başarıyla güncellendi',
      errorMessage: 'Şube durumu güncellenemedi. Lütfen tekrar deneyin.',
    },
    viewDialog: {
      title: 'Şubeyi Görüntüle',
      description: 'Şube detaylarını ve bilgilerini görüntüleyin.',
    },
  },
};
