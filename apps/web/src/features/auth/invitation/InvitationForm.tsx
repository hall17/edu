import {
  getNationalIdSchema,
  getPhoneNumberSchema,
  UserType,
  CountryCode,
} from '@edusama/common';
import { Gender } from '@edusama/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouteContext, useSearch } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import countries from '@/assets/countries.json';
import { LoadingButton } from '@/components';
import { CitySelector, CountrySelector, PhoneInput } from '@/components';
import { DatePicker } from '@/components/DatePicker';
import { DroppableImage } from '@/components/DroppableImage';
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
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
import { trpc } from '@/lib/trpc';
import { DEFAULT_IMAGE_SIZE } from '@/utils/constants';

export function InvitationForm({
  setSignedUpUserType,
}: {
  setSignedUpUserType: (userType: UserType) => void;
}) {
  const student = useRouteContext({ from: '/(auth)/invitation' });

  const { t } = useTranslation();
  const search = useSearch({ strict: false }) as { token?: string };
  const token = search.token;
  const [profilePictureFile, setProfilePictureFile] = useState<
    File | null | undefined
  >(undefined);
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
      profilePictureUrl: z.string().max(1000).nullable().optional(),
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

  async function onSubmit(data: InvitationFormValues) {
    try {
      if (!token) {
        toast.error(t('auth.invitation.form.error'));
        return;
      }

      const response = await completeSignupMutation.mutateAsync({
        ...data,
        token: token as string,
        dateOfBirth: data.dateOfBirth.toISOString(),
      });

      if (response && 'signedAwsS3Url' in response) {
        await fetch(response.signedAwsS3Url, {
          method: 'PUT',
          body: profilePictureFile,
        });
      }

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
                      name="profilePictureUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <DroppableImage
                              size="lg"
                              value={
                                profilePictureFile === null
                                  ? undefined
                                  : (field.value ?? undefined)
                              }
                              onChange={(file) => {
                                field.onChange(
                                  file
                                    ? file.name
                                    : file === null
                                      ? null
                                      : undefined
                                );
                                setProfilePictureFile(file);
                              }}
                              uploadText={t('common.uploadProfilePicture')}
                              changeText={t('common.changeProfilePicture')}
                              helpText={t('common.profilePictureUploadHelp')}
                              previewTitle={t('common.profilePicture')}
                              previewSubtitle={t(
                                'common.profilePicturePreview'
                              )}
                              maxSize={DEFAULT_IMAGE_SIZE}
                              accept={{
                                'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
                              }}
                            />
                          </FormControl>
                          <FormMessage />
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
