export const auth = {
  title: 'Giriş Yap',
  description: 'Hesabınıza giriş yapmak için lütfen bilgilerinizi giriniz',
  email: 'Email',
  password: 'Şifre',
  loginButton: 'Giriş Yap',
  logout: 'Çıkış Yap',
  pleaseEnterYourPassword: 'Lütfen şifrenizi giriniz',
  passwordMustBeAtLeastXCharactersLong:
    'Şifre en az {{count}} karakter olmalıdır',
  forgotPassword: 'Şifremi unuttum',
  forgotPasswordDescription:
    'Kayıtlı olduğunuz emaili giriniz ve <br /> şifrenizi sıfırlamak için bir link gönderilecektir.',
  acceptTerms:
    'Giriş yaparak, <1>hizmet şartlarını</1> ve <2>gizlilik politikasını</2> kabul etmiş olursunuz.',
  loginSuccessNotification:
    'Başarıyla giriş yapıldı, Anasayfaya yönlendiriliyorsunuz.',
  invitation: {
    title: 'Davetinizi Tamamlayın',
    description:
      'Hesap oluşturma işlemini tamamlamak için bilgilerinizi doldurun.',
    sections: {
      personalInformation: 'Kişisel Bilgiler',
      personalInformationDescription:
        'Kişisel bilgilerinizi ve profil bilgilerinizi girin.',
      contactInformation: 'İletişim Bilgileri',
      contactInformationDescription:
        'İletişim bilgilerinizi ve adres bilgilerinizi girin.',
      security: 'Güvenlik',
      securityDescription: 'Güvenli erişim için hesap şifrenizi belirleyin.',
    },
    form: {
      firstName: 'Ad',
      lastName: 'Soyad',
      email: 'Email',
      nationalId: 'T.C. Kimlik No',
      gender: 'Cinsiyet',
      selectGender: 'Cinsiyet seçiniz',
      dateOfBirth: 'Doğum tarihi',
      dateOfBirthPlaceholder: 'Tarih seçin',
      profilePictureUrl: 'Profil Fotoğrafı',
      profilePictureUrlHelp: 'Profil fotoğrafınızın URL adresini girin',
      profilePictureUploadHelp:
        'Resme tıklayın ve seçin veya sürükleyin • PNG, JPG, WEBP en fazla 5MB',
      changeProfilePicture: 'Profil fotoğrafını değiştir',
      uploadProfilePicture: 'Profil fotoğrafı yükle',
      phoneNumber: 'Telefon numarası',
      country: 'Ülke',
      city: 'Şehir',
      state: 'Eyalet',
      address: 'Adres',
      zipCode: 'Posta kodu',
      password: 'Şifre',
      confirmPassword: 'Şifreyi onayla',
      acceptInvitation: 'Daveti Kabul Et',
      success: 'Hesap başarıyla oluşturuldu! Artık giriş yapabilirsiniz.',
      error: 'Hesap oluşturulamadı. Lütfen tekrar deneyin.',
      awaitingApproval: {
        title: 'Kayıt Tamamlandı!',
        description: 'Kayıt işleminiz başarıyla tamamlanmıştır.',
        message:
          'Hesabınız şu anda yetkililerin onayını beklemektedir. Hesabınız onaylandığında ve sistemi kullanmaya başlayabileceğinizde e-posta ile bilgilendirileceksiniz.',
        note: 'Bu işlem 1-2 iş günü sürebilir.',
      },
      placeholders: {
        emailPlaceholder: 'isim@ornek.com',
      },
    },
    expired: {
      title: 'Davet Bağlantısı Süresi Doldu',
      description: 'Kullandığınız davet bağlantısı artık geçerli değil.',
      message:
        'Bu bağlantının süresi dolmuş veya zaten kullanılmış. Lütfen yeni bir davet için yetkililere başvurun.',
      contactNote:
        'Yeni bir bağlantı almak için lütfen yöneticinize veya size daveti gönderen kişiye başvurun.',
    },
  },
};
