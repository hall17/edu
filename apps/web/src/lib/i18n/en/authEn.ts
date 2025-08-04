export const auth = {
  title: 'Login',
  description: 'Login to your account to continue',
  email: 'Email',
  password: 'Password',
  loginButton: 'Login',
  logout: 'Log out',
  pleaseEnterYourPassword: 'Please enter your password',
  passwordMustBeAtLeastXCharactersLong:
    'Password must be at least {{count}} characters long',
  forgotPassword: 'Forgot password?',
  forgotPasswordDescription:
    'Enter your registered email and <br /> we will send you a link to reset your password.',
  acceptTerms:
    'By clicking login, you agree to our <1>terms of service</1> and <2>privacy policy</2>.',
  loginSuccessNotification:
    'Successfully logged in, you are now redirected to the dashboard.',
  invitation: {
    title: 'Complete Your Invitation',
    description: 'Fill out your information to complete your account setup.',
    sections: {
      personalInformation: 'Personal Information',
      personalInformationDescription:
        'Enter your personal details and profile information.',
      contactInformation: 'Contact Information',
      contactInformationDescription:
        'Provide your contact details and address information.',
      security: 'Security',
      securityDescription: 'Set up your account password for secure access.',
    },
    form: {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      nationalId: 'National ID',
      gender: 'Gender',
      selectGender: 'Select gender',
      dateOfBirth: 'Date of birth',
      dateOfBirthPlaceholder: 'Pick a date',
      profilePictureUrl: 'Profile Picture',
      profilePictureUrlHelp: 'Enter a URL to your profile picture',
      profilePictureUploadHelp:
        'Click or drag image • PNG, JPG, WEBP up to 5MB',
      changeProfilePicture: 'Change profile picture',
      uploadProfilePicture: 'Upload profile picture',
      phoneNumber: 'Phone number',
      country: 'Country',
      city: 'City',
      state: 'State',
      address: 'Address',
      zipCode: 'Zip code',
      password: 'Password',
      confirmPassword: 'Confirm password',
      acceptInvitation: 'Accept Invitation',
      success: 'Account created successfully! You can now log in.',
      error: 'Failed to create account. Please try again.',
      awaitingApproval: {
        title: 'Registration Complete!',
        description: 'Your sign-up process has been completed successfully.',
        message:
          'Your account is now waiting for approval from the authorities. You will be notified via email once your account has been approved and you can start using the system.',
        note: 'This process may take 1-2 business days.',
      },
      placeholders: {
        emailPlaceholder: 'name@example.com',
      },
    },
    expired: {
      title: 'Invitation Link Expired',
      description: 'The invitation link you used is no longer valid.',
      message:
        'This link has expired or has already been used. Please contact the authorities to request a new invitation.',
      contactNote:
        'Please contact your administrator or the person who sent you the invitation to get a new link.',
    },
  },
};
