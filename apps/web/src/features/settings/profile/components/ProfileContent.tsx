import {
  CountryCode,
  getNationalIdSchema,
  getPhoneNumberSchema,
} from '@edusama/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { Gender } from '@edusama/server';
import { useMutation } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { TFunction } from 'i18next';
import {
  X,
  User,
  Phone,
  MapPin,
  Link as LinkIcon,
  ArrowLeft,
} from 'lucide-react';
import { useMemo } from 'react';
import { FieldErrors, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import countries from '@/assets/countries.json';
import { LoadingButton } from '@/components';
import { CitySelector, CountrySelector, PhoneInput } from '@/components';
import { DatePicker } from '@/components/DatePicker';
import { DroppableImage } from '@/components/DroppableImage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/stores/authStore';

function getProfileFormSchema(t: TFunction) {
  return z
    .object({
      userId: z.string().optional(),
      nationalId: z.string().min(1),
      firstName: z.string().min(1).max(50),
      lastName: z.string().min(1).max(50),
      gender: z.nativeEnum(Gender),
      dateOfBirth: z.date(),
      email: z.string().email().max(100),
      profilePictureUrl: z.string().url().max(255).optional(),
      phoneCountryCode: z.string().min(1).max(50).optional(),
      phoneNumber: z.string().min(1).max(15),
      countryCode: z.string().min(1).max(2),
      city: z.string().min(1).max(50),
      state: z.string().max(50).optional(),
      address: z.string().min(1).max(255),
      zipCode: z.string().max(10).optional(),
      facebookLink: z.string().url().max(255).optional(),
      twitterLink: z.string().url().max(255).optional(),
      instagramLink: z.string().url().max(255).optional(),
      linkedinLink: z.string().url().max(255).optional(),
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
}

type ProfileFormValues = z.infer<ReturnType<typeof getProfileFormSchema>>;

interface ProfileContentProps {
  onCancel: () => void;
}

export function ProfileContent({ onCancel }: ProfileContentProps) {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const updateMeMutation = useMutation(trpc.auth.updateMe.mutationOptions());

  const profileFormSchema = useMemo(() => getProfileFormSchema(t), [t]);

  const defaultValues: ProfileFormValues = {
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    gender: user?.gender ?? (undefined as any),
    nationalId: user?.nationalId ?? '',
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth)
      : (undefined as any),
    phoneCountryCode: user?.phoneCountryCode ?? '',
    phoneNumber: user?.phoneNumber ?? '',
    profilePictureUrl: user?.profilePictureUrl ?? undefined,
    countryCode: user?.countryCode ?? '',
    city: user?.city ?? '',
    state: user?.state ?? '',
    zipCode: user?.zipCode ?? '',
    address: user?.address ?? '',
    facebookLink: user?.facebookLink ?? undefined,
    twitterLink: user?.twitterLink ?? undefined,
    instagramLink: user?.instagramLink ?? undefined,
    linkedinLink: user?.linkedinLink ?? undefined,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
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

  async function onSubmit(data: ProfileFormValues) {
    try {
      const diff = detailedDiff(defaultValues, data);

      if (!Object.keys(diff.updated).length) {
        onCancel();
        return;
      }

      const response = await updateMeMutation.mutateAsync({
        ...diff.updated,
      });

      const country = countries.find(
        (country) => country.iso2 === response?.countryCode
      );

      setUser({ ...response, country: country || null });
      toast.success(t('settings.profile.form.updateProfileSuccess'));
      onCancel();
    } catch (error) {
      console.error(error);
      toast.error(t('settings.profile.form.updateProfileError'));
    }
  }

  function handleCancel() {
    form.reset(defaultValues);
    onCancel();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <div>
            <h2 className="text-xl font-semibold">
              {t('settings.profile.form.editProfile')}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t('settings.profile.form.editProfileDescription')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <User className="text-primary h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">
                  {t('settings.profile.sections.personalInformation')}
                </h3>
              </div>
              <div className="space-y-6">
                {/* Profile Picture */}
                <FormField
                  control={form.control}
                  name="profilePictureUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('settings.profile.form.profilePictureUrl')}
                      </FormLabel>
                      <div className="flex items-start gap-4">
                        <Avatar className="size-16">
                          <AvatarImage
                            src={
                              field.value ||
                              user?.profilePictureUrl ||
                              undefined
                            }
                            alt="Profile preview"
                          />
                          <AvatarFallback className="text-sm">
                            {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                            {user?.lastName?.charAt(0)?.toUpperCase() || ''}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4">
                          <FormControl>
                            <Input
                              placeholder="https://example.com/profile-picture.jpg"
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-muted-foreground text-xs">
                            {t('settings.profile.form.profilePictureUrlHelp')}
                          </p>
                          <div className="border-border rounded-lg border-2 border-dashed p-4">
                            <DroppableImage
                              value={field.value}
                              onChange={field.onChange}
                              size="sm"
                              uploadText={t(
                                'settings.profile.form.uploadProfilePicture'
                              )}
                              changeText={t(
                                'settings.profile.form.changeProfilePicture'
                              )}
                              helpText={t(
                                'settings.profile.form.profilePictureHelpText'
                              )}
                              previewTitle={t(
                                'settings.profile.form.profilePicturePreview'
                              )}
                              maxSize={5 * 1024 * 1024} // 5MB for profile pictures
                              accept={{
                                'image/*': [
                                  '.jpeg',
                                  '.jpg',
                                  '.png',
                                  '.webp',
                                  '.svg',
                                ],
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('settings.profile.form.firstName')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('settings.profile.form.firstName')}
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
                          {t('settings.profile.form.lastName')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('settings.profile.form.lastName')}
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
                          {t('settings.profile.form.nationalId')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('settings.profile.form.nationalId')}
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
                          {t('settings.profile.form.dateOfBirth')}
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={field.value ?? undefined}
                            onSelect={field.onChange}
                            placeholder={t(
                              'settings.profile.form.dateOfBirthPlaceholder'
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
                          {t('settings.profile.form.gender')}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? undefined}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={t(
                                  'settings.profile.form.selectGender'
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
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('settings.profile.form.email')}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  {t('settings.profile.sections.contactInformation')}
                </h3>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('settings.profile.form.phoneNumber')}
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
                          {t('settings.profile.form.country')}
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
                          {t('settings.profile.form.city')}
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
                          {t('settings.profile.form.zipCode')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('settings.profile.form.zipCode')}
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
                            {t('settings.profile.form.state')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('settings.profile.form.state')}
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>
                        {t('settings.profile.form.address')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('settings.profile.form.address')}
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

            <Separator />

            {/* Social Links */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <LinkIcon className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  {t('settings.profile.sections.socialLinks')}
                </h3>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="facebookLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('settings.profile.form.facebookLink')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://facebook.com/username"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="twitterLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('settings.profile.form.xLink')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://x.com/username"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagramLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('settings.profile.form.instagramLink')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://instagram.com/username"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="linkedinLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('settings.profile.form.linkedinLink')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://linkedin.com/in/username"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
              <LoadingButton
                type="submit"
                className="min-w-[100px]"
                isLoading={updateMeMutation.isPending}
              >
                {t('common.save')}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
