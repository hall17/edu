import {
  CountryCode,
  getNationalIdSchema,
  getPhoneNumberSchema,
} from '@edusama/common';
import { Gender, UserStatus } from '@edusama/server';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { TFunction } from 'i18next';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import countries from '@/assets/countries.json';
import {
  CitySelector,
  CountrySelector,
  LoadingButton,
  MultiSelect,
  PhoneInput,
  UnsavedChangesDialog,
} from '@/components';
import { DatePicker } from '@/components/DatePicker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useParentsContext } from '@/features/parents/ParentsContext';
import { Parent, trpc } from '@/lib/trpc';

function getFormSchema(t: TFunction) {
  return z
    .object({
      nationalId: z.string().min(1).max(50),
      firstName: z.string().min(1).max(50),
      lastName: z.string().min(1).max(50),
      gender: z.nativeEnum(Gender),
      dateOfBirth: z.date(),
      email: z.string().email().max(100),
      profilePictureUrl: z.url().max(255).optional(),
      phoneCountryCode: z.string().min(1).max(50),
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
      status: z.nativeEnum(UserStatus),
      statusUpdateReason: z.string().max(255).optional(),
      studentIds: z.array(z.string()),
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
    )
    .refine(
      (data) => {
        if (data.status === UserStatus.SUSPENDED) {
          return (
            data.statusUpdateReason && data.statusUpdateReason.trim().length > 0
          );
        }
        return true;
      },
      {
        message: t('common.statusUpdateReasonRequired'),
        path: ['statusUpdateReason'],
      }
    );
}

type ParentForm = z.infer<ReturnType<typeof getFormSchema>>;

export function ParentsActionDialog() {
  const { t } = useTranslation();
  const {
    currentRow,
    setOpenedDialog,
    createParent,
    updateParent,
    studentsQuery,
    studentFilters,
    setStudentFilters,
  } = useParentsContext();
  const isEdit = !!currentRow;

  const createParentMutation = useMutation(
    trpc.parent.create.mutationOptions()
  );
  const updateParentMutation = useMutation(
    trpc.parent.update.mutationOptions()
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const formSchema = useMemo(() => getFormSchema(t), [t]);

  const defaultValues: ParentForm = isEdit
    ? {
        nationalId: currentRow?.nationalId ?? '',
        firstName: currentRow?.firstName ?? '',
        lastName: currentRow?.lastName ?? '',
        gender: currentRow?.gender ?? (undefined as unknown as Gender),
        dateOfBirth: currentRow?.dateOfBirth
          ? new Date(currentRow.dateOfBirth)
          : (undefined as unknown as Date),
        email: currentRow?.email ?? '',
        profilePictureUrl: currentRow?.profilePictureUrl ?? undefined,
        phoneCountryCode: currentRow?.phoneCountryCode ?? '',
        phoneNumber: currentRow?.phoneNumber ?? '',
        countryCode: currentRow?.countryCode ?? '',
        city: currentRow?.city ?? '',
        state: currentRow?.state ?? undefined,
        address: currentRow?.address ?? '',
        zipCode: currentRow?.zipCode ?? '',
        facebookLink: currentRow?.facebookLink ?? undefined,
        twitterLink: currentRow?.twitterLink ?? undefined,
        instagramLink: currentRow?.instagramLink ?? undefined,
        linkedinLink: currentRow?.linkedinLink ?? undefined,
        status: currentRow?.status ?? UserStatus.ACTIVE,
        statusUpdateReason: currentRow?.statusUpdateReason ?? undefined,
        studentIds: currentRow?.students?.map((student) => student.id) ?? [],
      }
    : {
        nationalId: '',
        firstName: '',
        lastName: '',
        gender: undefined as unknown as Gender,
        dateOfBirth: undefined as unknown as Date,
        email: '',
        profilePictureUrl: undefined,
        phoneCountryCode: '',
        phoneNumber: '',
        countryCode: '',
        city: '',
        state: undefined,
        address: '',
        zipCode: '',
        facebookLink: undefined,
        twitterLink: undefined,
        instagramLink: undefined,
        linkedinLink: undefined,
        status: UserStatus.ACTIVE,
        statusUpdateReason: undefined,
        studentIds: [],
      };

  const form = useForm<ParentForm>({
    resolver: zodResolver(formSchema),
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

  const status = useWatch({
    control: form.control,
    name: 'status',
  });

  function handleDialogClose(state: boolean) {
    let isDirty = false;

    if (form.formState.defaultValues) {
      const diff = detailedDiff(form.formState.defaultValues, form.getValues());
      isDirty =
        Object.keys(diff.updated).length > 0 ||
        Object.keys(diff.added).length > 0 ||
        Object.keys(diff.deleted).length > 0;
    }

    if (!state && isDirty) {
      // User is trying to close and form is dirty
      setShowConfirmDialog(true);
    } else {
      // Safe to close
      form.reset();
      setOpenedDialog(null);
    }
  }

  function handleConfirmClose() {
    setShowConfirmDialog(false);
    form.reset();
    setOpenedDialog(null);
  }

  function handleCancelClose() {
    setShowConfirmDialog(false);
  }

  async function onSubmit(values: ParentForm) {
    try {
      if (isEdit) {
        const diff = detailedDiff(defaultValues, values);

        if (
          !Object.keys(diff.updated).length &&
          !Object.keys(diff.added).length &&
          !Object.keys(diff.deleted).length
        ) {
          return;
        }

        const updateData = { ...diff.updated } as Record<string, unknown>;

        if (updateData.dateOfBirth) {
          updateData.dateOfBirth = (
            updateData.dateOfBirth as Date
          ).toISOString();
        }

        const response = await updateParentMutation.mutateAsync({
          id: currentRow.id,
          ...updateData,
          studentIds: values.studentIds,
        } as any);

        toast.success(t('dialogs.action.success.updateParent'));
        updateParent(response as Parent);
      } else {
        const createData = {
          ...values,
          dateOfBirth: values.dateOfBirth.toISOString(),
        };

        const response = await createParentMutation.mutateAsync(
          createData as any
        );

        toast.success(t('dialogs.action.success.createParent'));
        createParent(response as Parent);
      }
      form.reset();
      setOpenedDialog(null);
    } catch {}
  }

  const renderPersonalInformationSection = () => (
    <div className="space-y-4">
      <div className="border-border border-b pb-4">
        <div className="mb-3">
          <span className="text-base font-semibold capitalize">
            {t('students.actionDialog.sections.personalInformation')}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('common.firstName')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      'students.actionDialog.placeholders.firstName'
                    )}
                    autoComplete="off"
                    {...field}
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
                <FormLabel required>{t('common.lastName')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      'students.actionDialog.placeholders.lastName'
                    )}
                    autoComplete="off"
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
                <FormLabel required>{t('common.nationalId')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      'students.actionDialog.placeholders.nationalId'
                    )}
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
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('common.dateOfBirth')}</FormLabel>
                <div>
                  <DatePicker
                    selected={field.value ?? undefined}
                    onSelect={field.onChange}
                    placeholder={t('common.selectDateOfBirth')}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('common.gender')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('common.selectGender')} />
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
            name="studentIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('common.myChildren')}</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={
                      studentsQuery.data?.students
                        ?.map((student) => ({
                          label: `${student.firstName} ${student.lastName} (${t('common.nationalId')} ${student.nationalId})`,
                          value: student.id,
                        }))
                        .concat(
                          currentRow?.students?.map((student) => ({
                            label: `${student.firstName} ${student.lastName} (${t('common.nationalId')} ${student.nationalId})`,
                            value: student.id,
                          })) ?? []
                        ) ?? []
                    }
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    onSearchValueChange={(value) => {
                      setStudentFilters({
                        ...studentFilters,
                        q: value,
                      });
                    }}
                    defaultValue={field.value || []}
                    placeholder={t('common.search')}
                    searchable={true}
                    maxCount={5}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );

  const renderContactInformationSection = () => (
    <div className="space-y-4">
      <div className="border-border border-b pb-6">
        <div className="mb-3">
          <span className="text-base font-semibold capitalize">
            {t('students.actionDialog.sections.contactInformation')}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('common.email')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('students.actionDialog.placeholders.email')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('common.phoneNumber')}</FormLabel>
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

          <div className={'col-span-2 grid grid-cols-2 gap-2'}>
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t('common.country')}</FormLabel>
                  <FormControl>
                    <CountrySelector
                      value={field.value}
                      onValueChange={(countryCode) => {
                        const currentCountry = form.getValues('countryCode');
                        if (currentCountry === 'TR' && countryCode !== 'TR') {
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
            {/* show state only if country is US */}
            {form.watch('countryCode') === 'US' && (
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.state')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'students.actionDialog.placeholders.state'
                        )}
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
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t('common.city')}</FormLabel>
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
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel required>{t('common.address')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t(
                      'students.actionDialog.placeholders.address'
                    )}
                    className="resize-none"
                    {...field}
                    rows={3}
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
              <FormItem className="md:col-span-1">
                <FormLabel>{t('common.zipCode')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      'students.actionDialog.placeholders.zipCode'
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
    </div>
  );

  const renderSocialLinksSection = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <span className="text-base font-semibold capitalize">
          {t('students.actionDialog.sections.socialLinks')}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="facebookLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.facebook')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'students.actionDialog.placeholders.facebookLink'
                  )}
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
              <FormLabel>{t('common.twitter')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'students.actionDialog.placeholders.twitterLink'
                  )}
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
              <FormLabel>{t('common.instagram')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'students.actionDialog.placeholders.instagramLink'
                  )}
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
              <FormLabel>{t('common.linkedin')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'students.actionDialog.placeholders.linkedinLink'
                  )}
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
  );

  const renderStatusSection = () => (
    <div className="space-y-4">
      <div className="border-border border-b pb-4">
        <div className="mb-3">
          <span className="text-base font-semibold capitalize">
            {t('students.actionDialog.sections.status')}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('common.status')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('common.selectStatus')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(UserStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`userStatuses.${status}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {status === UserStatus.SUSPENDED && (
            <FormField
              control={form.control}
              name="statusUpdateReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t('common.statusUpdateReason')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'students.actionDialog.placeholders.statusUpdateReason'
                      )}
                      className="resize-none"
                      {...field}
                      value={field.value ?? ''}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderFormFields = () => (
    <div className="space-y-2">
      {renderPersonalInformationSection()}
      {renderContactInformationSection()}
      {isEdit && renderStatusSection()}
      {renderSocialLinksSection()}
    </div>
  );

  return (
    <>
      <Dialog open onOpenChange={handleDialogClose}>
        <DialogContent className="xs:max-w-[80%] sm:max-w-[70%]">
          <DialogHeader className="mb-8 text-left">
            <DialogTitle>
              {isEdit
                ? t('dialogs.action.editTitleParent')
                : t('dialogs.action.addTitleParent')}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? t('dialogs.action.editDescriptionParent')
                : t('dialogs.action.addDescriptionParent')}
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4">
            <Form {...form}>
              <form
                id="parent-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 p-0.5"
              >
                {renderFormFields()}
              </form>
            </Form>
          </div>
          <DialogFooter>
            <LoadingButton
              type="submit"
              form="parent-form"
              isLoading={
                updateParentMutation.isPending || createParentMutation.isPending
              }
            >
              {isEdit
                ? t('dialogs.action.form.saveChanges')
                : t('dialogs.action.form.create')}
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UnsavedChangesDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </>
  );
}
