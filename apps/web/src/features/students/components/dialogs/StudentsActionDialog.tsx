import {
  CountryCode,
  getNationalIdSchema,
  getPhoneNumberSchema,
} from '@edusama/common';
import { Gender, StudentStatus } from '@edusama/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { TFunction } from 'i18next';
import { FileSpreadsheet, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import countries from '@/assets/countries.json';
import {
  CitySelector,
  CountrySelector,
  FileDroppableArea,
  LoadingButton,
  PhoneInput,
  UnsavedChangesDialog,
} from '@/components';
import { DatePicker } from '@/components/DatePicker';
import { DroppableImage } from '@/components/DroppableImage';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useStudentsContext } from '@/features/students/StudentsContext';
import { Student, trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { getAcceptedFileTypes } from '@/utils';

interface Props {
  currentRow?: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getFormSchema(t: TFunction) {
  return z
    .object({
      status: z.nativeEnum(StudentStatus),
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
      statusUpdateReason: z.string().optional(),
      facebookLink: z.string().url().max(255).optional(),
      twitterLink: z.string().url().max(255).optional(),
      instagramLink: z.string().url().max(255).optional(),
      linkedinLink: z.string().url().max(255).optional(),
      parentId: z.string().optional(),
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

type StudentForm = z.infer<ReturnType<typeof getFormSchema>>;

export function StudentsActionDialog() {
  const { t } = useTranslation();
  const { currentRow, setOpenedDialog, createStudent, updateStudent } =
    useStudentsContext();
  const createStudentMutation = useMutation(
    trpc.student.create.mutationOptions()
  );
  const updateStudentMutation = useMutation(
    trpc.student.update.mutationOptions()
  );
  const createStudentsFromExcelMutation = useMutation(
    trpc.student.createFromExcel.mutationOptions()
  );
  const parentsQuery = useQuery(
    trpc.parent.findAll.queryOptions({
      all: true,
      noStudents: true,
    })
  );

  const [selectedTab, setSelectedTab] = useState<
    'single-import' | 'excel-import'
  >('single-import');

  const [file, setFile] = useState<File | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isEdit = !!currentRow;

  const formSchema = useMemo(() => getFormSchema(t), [t]);
  const defaultValues: StudentForm = isEdit
    ? {
        status: currentRow?.status ?? StudentStatus.ACTIVE,
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
        statusUpdateReason: currentRow?.statusUpdateReason ?? undefined,
        facebookLink: currentRow?.facebookLink ?? undefined,
        twitterLink: currentRow?.twitterLink ?? undefined,
        instagramLink: currentRow?.instagramLink ?? undefined,
        linkedinLink: currentRow?.linkedinLink ?? undefined,
        parentId: currentRow?.parent?.id ?? undefined,
      }
    : {
        status: StudentStatus.ACTIVE,
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
        statusUpdateReason: undefined,
        facebookLink: undefined,
        twitterLink: undefined,
        instagramLink: undefined,
        linkedinLink: undefined,
        parentId: undefined,
      };

  const form = useForm<StudentForm>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  // Create a memoized countries map for O(1) lookups instead of O(n) searches
  const countriesMap = useMemo(() => {
    const map = new Map<string, (typeof countries)[0]>();
    countries.forEach((country) => map.set(country.iso2, country));
    return map;
  }, []);

  // Watch form values more efficiently
  const watchedValues = useWatch({
    control: form.control,
    name: ['phoneCountryCode', 'countryCode', 'status'],
  });
  const status = watchedValues[2];

  // Memoize expensive computations
  const phoneCountry = useMemo(() => {
    return watchedValues[0] ? countriesMap.get(watchedValues[0]) : undefined;
  }, [watchedValues[0], countriesMap]);

  const currentCountryCode = watchedValues[1];

  async function onSubmit(values: StudentForm) {
    try {
      if (isEdit) {
        const diff = detailedDiff(defaultValues, values);

        if (!Object.keys(diff.updated).length) {
          return;
        }

        const updateData = { ...diff.updated } as Record<string, unknown>;

        const response = await updateStudentMutation.mutateAsync({
          id: currentRow.id,
          ...updateData,
        } as any);

        toast.success(t('dialogs.action.success.updateStudent'));
        updateStudent(response as unknown as Student);

        if (response && 'signedAwsS3Url' in response) {
          await fetch(response.signedAwsS3Url, {
            method: 'PUT',
            body: profilePictureFile,
          });
        }
      } else {
        const createData = {
          ...values,
          dateOfBirth: values.dateOfBirth.toISOString(),
        };

        const response = await createStudentMutation.mutateAsync(
          createData as any
        );

        toast.success(t('dialogs.action.success.createStudent'));
        createStudent(response as unknown as Student);

        if (response && 'signedAwsS3Url' in response) {
          await fetch(response.signedAwsS3Url, {
            method: 'PUT',
            body: profilePictureFile,
          });
          console.log('profilePictureFile', profilePictureFile);
        }
      }
    } catch {}

    form.reset();
    setOpenedDialog(null);
  }

  async function onExcelImportSubmit() {
    try {
      const formData = new FormData();
      formData.append('file', file as any);

      const response = await createStudentsFromExcelMutation.mutateAsync(
        formData as any
      );

      // Handle the detailed response
      const { successCount, failedCount, failedStudents } = response;
      const totalProcessed = successCount + failedCount;

      if (failedCount === 0) {
        // All successful
        toast.success(
          `${t('students.actionDialog.importResult.success')}\n${t('students.actionDialog.importResult.totalProcessed', { count: totalProcessed })}\n${t('students.actionDialog.importResult.successfulImports', { count: successCount })}`
        );
      } else if (successCount > 0) {
        // Partial success
        let message = `${t('students.actionDialog.importResult.successWithErrors')}\n`;
        message += `${t('students.actionDialog.importResult.totalProcessed', { count: totalProcessed })}\n`;
        message += `${t('students.actionDialog.importResult.successfulImports', { count: successCount })}\n`;
        message += `${t('students.actionDialog.importResult.failedImports', { count: failedCount })}\n\n`;

        if (failedStudents.length > 0) {
          message += `${t('students.actionDialog.importResult.failedStudentsList')}\n`;
          failedStudents.forEach((student) => {
            const reason =
              student.reason === 'corruptedData'
                ? t(
                    'students.actionDialog.importResult.failureReasons.corruptedData'
                  )
                : t(
                    'students.actionDialog.importResult.failureReasons.duplicate'
                  );
            message += `${t(
              'students.actionDialog.importResult.failedStudentInfo',
              {
                row: student.row,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                reason,
              }
            )}\n`;
            if (student.failedFields.length > 0) {
              message += `  ${t('students.actionDialog.importResult.failedFields', { fields: student.failedFields.join(', ') })}\n`;
            }
          });
        }

        toast.warning(message);
      } else {
        // All failed
        let message = `${t('students.actionDialog.error.import')}\n`;
        message += `${t('students.actionDialog.importResult.failedImports', { count: failedCount })}\n\n`;

        if (failedStudents.length > 0) {
          message += `${t('students.actionDialog.importResult.failedStudentsList')}\n`;
          failedStudents.forEach((student) => {
            const reason =
              student.reason === 'corruptedData'
                ? t(
                    'students.actionDialog.importResult.failureReasons.corruptedData'
                  )
                : t(
                    'students.actionDialog.importResult.failureReasons.duplicate'
                  );
            message += `${t(
              'students.actionDialog.importResult.failedStudentInfo',
              {
                row: student.row,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                reason,
              }
            )}\n`;
            if (student.failedFields.length > 0) {
              message += `  ${t('students.actionDialog.importResult.failedFields', { fields: student.failedFields.join(', ') })}\n`;
            }
          });
        }

        toast.error(message);
      }
    } catch {
      toast.error(t('students.actionDialog.error.import'));
    }
  }

  function handleDialogClose(state: boolean) {
    let isDirty = false;

    if (form.formState.defaultValues) {
      const diff = detailedDiff(form.formState.defaultValues, form.getValues());
      isDirty =
        Object.keys(diff.updated).length > 0 ||
        Object.keys(diff.added).length > 0 ||
        Object.keys(diff.deleted).length > 0;
    }

    if (!state && (isDirty || file || profilePictureFile)) {
      // User is trying to close and form is dirty or file is selected
      setShowConfirmDialog(true);
    } else {
      // Safe to close
      handleConfirmClose();
    }
  }

  function handleConfirmClose() {
    setShowConfirmDialog(false);
    form.reset();
    setFile(null);
    setProfilePictureFile(null);
    setOpenedDialog(null);
  }

  function handleCancelClose() {
    setShowConfirmDialog(false);
  }

  const renderPersonalInformationSection = () => (
    <div className="space-y-4">
      <div className="border-border border-b pb-4">
        <div className="mb-3">
          <span className="text-base font-semibold capitalize">
            {t('students.actionDialog.sections.personalInformation')}
          </span>
        </div>
        <div className="grid w-full grid-cols-1 space-y-4 gap-x-2 md:grid-cols-6">
          <FormField
            control={form.control}
            name="profilePictureUrl"
            render={({ field }) => (
              <FormItem className="md:col-span-2 lg:col-span-1">
                <FormLabel className="justify-center">
                  {t('common.profilePicture')}
                </FormLabel>
                <FormControl>
                  <DroppableImage
                    size="2xl"
                    value={field.value}
                    onChange={(file) => {
                      field.onChange(file ? file.name : undefined);
                      setProfilePictureFile(file);
                    }}
                    uploadText={t('common.uploadProfilePicture')}
                    changeText={t('common.changeProfilePicture')}
                    helpText={t('common.profilePictureUploadHelp')}
                    previewTitle={t('common.profilePicture')}
                    previewSubtitle={t('common.profilePicturePreview')}
                    maxSize={5 * 1024 * 1024}
                    accept={{
                      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid w-full grid-cols-1 items-start gap-4 md:col-span-4 md:grid-cols-2 lg:col-span-5">
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
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.parent')}</FormLabel>
                  <div>
                    <Combobox
                      options={
                        parentsQuery.data?.parents?.map((parent) => ({
                          label: `${parent.firstName} ${parent.lastName}`,
                          value: parent.id,
                        })) ?? []
                      }
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                      placeholder={t(
                        'students.actionDialog.placeholders.parent'
                      )}
                      searchPlaceholder={t('combobox.searchParents')}
                      emptyText={t('combobox.noParentsFound')}
                      disabled={parentsQuery.isLoading}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
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

          <div
            className={cn('col-span-2 grid grid-cols-2 items-start gap-2', {
              'grid-cols-3': currentCountryCode === 'US',
            })}
          >
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
            {currentCountryCode === 'US' && (
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
                      country={currentCountryCode}
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
              <FormItem className="flex flex-col md:col-span-1">
                <FormLabel className="h-max">{t('common.zipCode')}</FormLabel>
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
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
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

  const renderStatusSection = () => {
    return (
      <div className="space-y-4">
        <div className="border-border border-b pb-4">
          <div className="mb-3">
            <span className="text-base font-semibold capitalize">
              {t('students.actionDialog.sections.status')}
            </span>
          </div>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t('common.status')}</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('common.selectStatus')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(StudentStatus)
                        .filter(
                          (status) =>
                            status !== StudentStatus.REQUESTED_APPROVAL &&
                            status !== StudentStatus.REQUESTED_CHANGES
                        )
                        .map((status) => (
                          <SelectItem key={status} value={status}>
                            {t(`studentStatuses.${status}`)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {status !== StudentStatus.INVITED &&
              status !== StudentStatus.ACTIVE && (
                <>
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
                </>
              )}
          </div>
        </div>
      </div>
    );
  };

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
        <DialogContent
          className={cn('xs:max-w-[80%] sm:max-w-[70%]', {
            'md:min-h-[860px]': selectedTab === 'single-import',
          })}
        >
          {isEdit ? (
            // Edit mode: Show only single student form without tabs
            <div className="w-full px-8">
              <DialogHeader className="">
                <DialogTitle>
                  {t('dialogs.action.editTitleStudent')}
                </DialogTitle>
                <DialogDescription>
                  {t('dialogs.action.editDescriptionStudent')}
                </DialogDescription>
              </DialogHeader>

              <div className="mb-4">
                <Form {...form}>
                  <form
                    id="student-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 p-0.5"
                    tabIndex={0}
                  >
                    {renderFormFields()}
                  </form>
                </Form>
              </div>
              <DialogFooter>
                <LoadingButton
                  type="submit"
                  form="student-form"
                  isLoading={
                    updateStudentMutation.isPending ||
                    createStudentMutation.isPending
                  }
                >
                  {t('dialogs.action.form.saveChanges')}
                </LoadingButton>
              </DialogFooter>
            </div>
          ) : (
            // Create mode: Show tabs for single student and excel import
            <Tabs
              value={selectedTab}
              onValueChange={(value) =>
                setSelectedTab(value as 'single-import' | 'excel-import')
              }
              className="w-full px-8"
            >
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="single-import">
                  <User className="mr-2 size-6" />
                  {t('students.actionDialog.tabs.singleStudent')}
                </TabsTrigger>
                <TabsTrigger value="excel-import">
                  <FileSpreadsheet className="mr-2 size-6" />
                  {t('students.actionDialog.tabs.excelImport')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="single-import">
                <DialogHeader className="mb-8 text-left">
                  <DialogTitle>
                    {t('dialogs.action.addTitleStudent')}
                  </DialogTitle>
                </DialogHeader>

                <div className="mb-4">
                  <Form {...form}>
                    <form
                      id="student-form"
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-2 p-0.5"
                    >
                      {renderFormFields()}
                    </form>
                  </Form>
                </div>
                <DialogFooter>
                  <LoadingButton
                    type="submit"
                    form="student-form"
                    isLoading={
                      updateStudentMutation.isPending ||
                      createStudentMutation.isPending
                    }
                  >
                    {t('dialogs.action.form.create')}
                  </LoadingButton>
                </DialogFooter>
              </TabsContent>
              <TabsContent value="excel-import">
                <DialogHeader className="mb-8 text-left">
                  <DialogTitle>
                    {t('dialogs.action.addTitleStudent')}
                  </DialogTitle>
                  <DialogDescription>
                    {t('dialogs.action.addDescriptionStudent')}
                  </DialogDescription>
                </DialogHeader>

                <div className="mb-4">
                  <FileDroppableArea
                    accept={getAcceptedFileTypes('excel')}
                    onDrop={(files) => setFile(files[0] as any)}
                    selectedFile={file}
                  />
                </div>
                <DialogFooter>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href="/sample.xlsx"
                      download="student_import_template.xlsx"
                    >
                      {t('students.actionDialog.downloadSample')}
                    </a>
                  </Button>
                  <LoadingButton
                    onClick={onExcelImportSubmit}
                    disabled={!file}
                    isLoading={createStudentsFromExcelMutation.isPending}
                  >
                    {t('students.actionDialog.importButton')}
                  </LoadingButton>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          )}
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
