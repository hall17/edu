import {
  getNationalIdSchema,
  getPhoneNumberSchema,
  UserType,
  CountryCode,
} from '@edusama/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { Gender } from '@prisma/client';
import {
  IconCamera,
  IconCheck,
  IconEdit,
  IconTrash,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import { TFunction } from 'i18next';
import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FieldErrors, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useOnClickOutside } from 'usehooks-ts';
import { z } from 'zod';

import countries from '@/assets/countries.json';
import { LoadingButton } from '@/components';
import { CitySelector, CountrySelector, PhoneInput } from '@/components';
import { DatePicker } from '@/components/DatePicker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { trpc } from '@/lib/trpc';

export function InvitationForm({
  setSignedUpUserType,
}: {
  setSignedUpUserType: (userType: UserType) => void;
}) {
  const student = useRouteContext({ from: '/(auth)/invitation' });

  const { t } = useTranslation();
  const search = useSearch({ strict: false }) as { token?: string };
  const token = search.token;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const dialogContentRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dialogContentRef as any, () => setIsPreviewOpen(false));
  const completeSignupMutation = useMutation(
    trpc.auth.completeSignup.mutationOptions()
  );

  const baseSchema = z
    .object({
      firstName: z.string().min(1).max(50),
      lastName: z.string().min(1).max(50),
      email: z.string().email().max(100),
      nationalId: z.string().min(1).max(50),
      gender: z.nativeEnum(Gender),
      dateOfBirth: z.date(),
      profilePicture: z.instanceof(File).optional(),
      profilePictureUrl: z.string().optional(),
      phoneCountryCode: z.string().min(1).max(50),
      phoneNumber: z.string().min(1).max(15),
      countryCode: z.string().min(1).max(2),
      city: z.string().min(1).max(50),
      state: z.string().max(50).optional(),
      address: z.string().min(1).max(255),
      zipCode: z.string().min(1).max(10).optional(),
    })
    .refine(
      (data) => {
        const parsedPhoneNumberResult = getPhoneNumberSchema(
          data.phoneCountryCode as CountryCode
        ).safeParse(data.phoneNumber);

        return parsedPhoneNumberResult.success;
      },
      {
        message: t('common.phoneNumberInvalid'),
        path: ['phoneNumber'],
      }
    )
    .refine(
      (data) => {
        const parsedNationalIdResult = getNationalIdSchema(
          data.countryCode as CountryCode
        ).safeParse(data.nationalId);
        return parsedNationalIdResult.success;
      },
      {
        message: t('common.nationalIdInvalid'),
        path: ['nationalId'],
      }
    );

  const schemaWithPassword = z
    .object({
      ...baseSchema.shape,
      password: z.string().min(8).max(20),
      confirmPassword: z.string().min(1),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('common.passwordsDoNotMatch'),
      path: ['confirmPassword'],
    });

  const selectedSchema = student?.status ? baseSchema : schemaWithPassword;
  type InvitationFormValues = z.infer<typeof schemaWithPassword>;

  const defaultValues: InvitationFormValues = {
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    email: student?.email || '',
    nationalId: student?.nationalId || '',
    gender: student?.gender || (undefined as any),
    dateOfBirth: student?.dateOfBirth
      ? new Date(student?.dateOfBirth)
      : (undefined as unknown as Date),
    profilePictureUrl: student?.profilePictureUrl || undefined,
    phoneCountryCode: student?.phoneCountryCode || '',
    phoneNumber: student?.phoneNumber || '',
    countryCode: student?.countryCode || '',
    city: student?.city || '',
    state: student?.state || '',
    address: student?.address || '',
    zipCode: student?.zipCode || '',
    password: '',
    confirmPassword: '',
  };

  const form = useForm<InvitationFormValues>({
    resolver: zodResolver(selectedSchema as any),
    defaultValues,
    mode: 'onSubmit',
  });

  const phoneCountry = useWatch({
    control: form.control,
    name: 'phoneCountryCode',
    compute: (value) => {
      return countries.find((c) => c.iso2 === value);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          toast.error(t('common.profilePictureFileTypeError'));
          return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
          toast.error(t('common.profilePictureFileSizeError'));
          return;
        }

        form.setValue('profilePicture', file);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [form]
  );

  // Avatar dropzone
  const {
    getRootProps: getAvatarRootProps,
    getInputProps: getAvatarInputProps,
    isDragActive: isAvatarDragActive,
    inputRef,
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
    noClick: false,
  });

  const removeImage = useCallback(() => {
    form.setValue('profilePicture', undefined);
    setImagePreview(null);
    setIsPreviewOpen(false);
  }, [form]);

  async function onSubmit(data: InvitationFormValues) {
    try {
      if (!token) {
        toast.error(t('auth.invitation.form.error'));
        return;
      }

      const { profilePicture, ...rest } = data;

      const response = await completeSignupMutation.mutateAsync({
        ...rest,
        token: token as string,
        dateOfBirth: rest.dateOfBirth.toISOString(),
      });

      setSignedUpUserType(response.userType);
    } catch (error) {
      console.error(error);
      toast.error(t('auth.invitation.form.error'));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('auth.invitation.title')}</CardTitle>
        <CardDescription>{t('auth.invitation.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="border-border border-b pb-4">
                  <div className="mb-3">
                    <span className="text-base font-semibold capitalize">
                      {t('auth.invitation.sections.personalInformation')}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {/* Profile Picture */}
                    <FormField
                      control={form.control}
                      name="profilePicture"
                      render={({ field }) => (
                        <FormItem className="justify-center">
                          <div className="flex items-center justify-center gap-4">
                            {/* Droppable Avatar */}
                            <div className="relative">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      {...getAvatarRootProps()}
                                      className={`group relative cursor-pointer transition-all duration-200 ${
                                        isAvatarDragActive
                                          ? 'ring-primary scale-105 ring-2 ring-offset-2'
                                          : ''
                                      }`}
                                      onClick={(e) => {
                                        if (field.value) {
                                          setIsPreviewOpen(true);
                                        } else {
                                          inputRef.current?.click();
                                        }
                                      }}
                                    >
                                      <FormControl>
                                        <input
                                          {...getAvatarInputProps()}
                                          ref={inputRef}
                                        />
                                      </FormControl>
                                      <Avatar className="size-24 transition-all duration-200 group-hover:brightness-75">
                                        <AvatarImage
                                          src={imagePreview || undefined}
                                          alt="Profile preview"
                                          className="object-cover"
                                        />
                                        <AvatarFallback className="text-lg font-semibold">
                                          {form
                                            .watch('firstName')
                                            ?.charAt(0)
                                            ?.toUpperCase() || 'U'}
                                          {form
                                            .watch('lastName')
                                            ?.charAt(0)
                                            ?.toUpperCase() || ''}
                                        </AvatarFallback>
                                      </Avatar>

                                      {/* Hover Overlay with Actions */}
                                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        {field.value ? (
                                          <div className="flex gap-2">
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 rounded-full bg-white/20 p-0 text-white hover:bg-white/30"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                inputRef.current?.click();
                                              }}
                                            >
                                              <IconEdit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 rounded-full bg-white/20 p-0 text-white hover:bg-red-500/80"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage();
                                              }}
                                            >
                                              <IconTrash className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        ) : (
                                          <IconCamera className="h-6 w-6 text-white" />
                                        )}
                                      </div>

                                      {/* Drag Active Overlay */}
                                      {isAvatarDragActive && (
                                        <div className="bg-primary/20 ring-primary absolute inset-0 flex items-center justify-center rounded-full ring-2">
                                          <IconUpload className="text-primary h-6 w-6" />
                                        </div>
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    <div className="text-center">
                                      <p className="font-medium">
                                        {field.value
                                          ? imagePreview
                                            ? t(
                                                'auth.invitation.form.changeProfilePicture'
                                              )
                                            : t(
                                                'auth.invitation.form.changeProfilePicture'
                                              )
                                          : t(
                                              'auth.invitation.form.uploadProfilePicture'
                                            )}
                                      </p>
                                      <p className="text-xs">
                                        {t(
                                          'auth.invitation.form.profilePictureUploadHelp'
                                        )}
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              {/* Image Preview Dialog */}
                              <Dialog
                                open={isPreviewOpen}
                                onOpenChange={setIsPreviewOpen}
                              >
                                <DialogTrigger asChild>
                                  <div className="hidden" />
                                </DialogTrigger>
                                <DialogContent
                                  showCloseButton={false}
                                  className="flex max-h-[95vh] max-w-[95vw] min-w-full items-center justify-center border-0 bg-transparent p-0 shadow-none select-none"
                                >
                                  <div className="relative flex h-full w-full items-center justify-center">
                                    <div
                                      ref={dialogContentRef}
                                      className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900"
                                    >
                                      <img
                                        src={imagePreview || undefined}
                                        alt="Profile preview"
                                        className="h-auto max-h-[85vh] w-auto max-w-[85vw] object-contain"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/20 p-0 text-white backdrop-blur-sm hover:bg-black/40"
                                        onClick={() => setIsPreviewOpen(false)}
                                      >
                                        <IconX className="h-5 w-5" />
                                      </Button>

                                      {/* Image info overlay */}
                                      {field.value && (
                                        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                                          <div className="text-white">
                                            <p className="text-lg font-medium">
                                              {field.value.name}
                                            </p>
                                            <p className="text-sm opacity-80">
                                              {(
                                                field.value.size /
                                                1024 /
                                                1024
                                              ).toFixed(2)}{' '}
                                              MB • {field.value.type}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          {/* File Info */}
                          <div className="flex flex-col gap-2">
                            {field.value && (
                              <div className="space-y-2 text-center">
                                <div className="flex items-center gap-2">
                                  <IconCheck className="h-4 w-4 text-green-600" />
                                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                    {field.value.name}
                                  </p>
                                </div>
                                <p className="text-muted-foreground text-xs">
                                  {(field.value.size / 1024 / 1024).toFixed(2)}{' '}
                                  MB
                                </p>
                              </div>
                            )}
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>
                              {t('auth.invitation.form.firstName')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t(
                                  'auth.invitation.form.firstName'
                                )}
                                {...field}
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>
                              {t('auth.invitation.form.lastName')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('auth.invitation.form.lastName')}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>
                              {t('auth.invitation.form.email')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled
                                placeholder={t(
                                  'auth.invitation.form.placeholders.emailPlaceholder'
                                )}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nationalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>
                              {t('auth.invitation.form.nationalId')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t(
                                  'auth.invitation.form.nationalId'
                                )}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>
                              {t('auth.invitation.form.dateOfBirth')}
                            </FormLabel>
                            <FormControl>
                              <DatePicker
                                selected={field.value ?? undefined}
                                onSelect={field.onChange}
                                placeholder={t(
                                  'auth.invitation.form.dateOfBirthPlaceholder'
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>
                              {t('auth.invitation.form.gender')}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? undefined}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={t(
                                      'auth.invitation.form.selectGender'
                                    )}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.values(Gender).map((gender) => (
                                  <SelectItem key={gender} value={gender}>
                                    {t(`genders.${gender}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-border border-b pb-6">
                  <div className="mb-3">
                    <span className="text-base font-semibold capitalize">
                      {t('auth.invitation.sections.contactInformation')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>
                            {t('auth.invitation.form.phoneNumber')}
                          </FormLabel>
                          <FormControl>
                            <PhoneInput
                              country={phoneCountry}
                              onCountryChange={(countryCode) => {
                                form.setValue('phoneCountryCode', countryCode);
                              }}
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>
                            {t('auth.invitation.form.country')}
                          </FormLabel>
                          <FormControl>
                            <CountrySelector
                              value={field.value}
                              onValueChange={(countryCode) => {
                                const currentCountry =
                                  form.getValues('countryCode');
                                if (
                                  currentCountry === 'TR' &&
                                  countryCode !== 'TR'
                                ) {
                                  form.setValue('city', '');
                                }

                                form.setValue('countryCode', countryCode);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>
                            {t('auth.invitation.form.city')}
                          </FormLabel>
                          <FormControl>
                            <CitySelector
                              country={form.watch('countryCode')}
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('auth.invitation.form.zipCode')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('auth.invitation.form.zipCode')}
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* show state only if country is US */}
                    {form.watch('countryCode') === 'US' && (
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t('auth.invitation.form.state')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('auth.invitation.form.state')}
                                {...field}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-1">
                          <FormLabel required>
                            {t('auth.invitation.form.address')}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t('auth.invitation.form.address')}
                              className="resize-none"
                              {...field}
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Password Section */}
                {!student?.status && (
                  <div>
                    <div className="mb-3">
                      <span className="text-base font-semibold capitalize">
                        {t('auth.invitation.sections.security')}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>
                              {t('auth.invitation.form.password')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder={t('auth.invitation.form.password')}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>
                              {t('auth.invitation.form.confirmPassword')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder={t(
                                  'auth.invitation.form.confirmPassword'
                                )}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6">
                <LoadingButton
                  type="submit"
                  isLoading={completeSignupMutation.isPending}
                  className="w-full"
                >
                  {t('auth.invitation.form.acceptInvitation')}
                </LoadingButton>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
