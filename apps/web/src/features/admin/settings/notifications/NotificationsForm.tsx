import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { TFunction } from 'i18next';
import { Bell, Mail, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { LoadingButton } from '@/components';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { showSubmittedData } from '@/utils/showSubmittedData';

const notificationsFormSchema = (t: TFunction) =>
  z.object({
    type: z.enum(['all', 'mentions', 'none'], {
      error: (iss) =>
        iss.input === undefined
          ? t('settings.notifications.pleaseSelectNotificationType')
          : undefined,
    }),
    mobile: z.boolean().default(false).optional(),
    communication_emails: z.boolean().default(false).optional(),
    social_emails: z.boolean().default(false).optional(),
    marketing_emails: z.boolean().default(false).optional(),
    security_emails: z.boolean(),
  });

type NotificationsFormValues = z.infer<
  ReturnType<typeof notificationsFormSchema>
>;

// This can come from your database or API.
const defaultValues: Partial<NotificationsFormValues> = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
};

export function NotificationsForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema(t)),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          setIsLoading(true);
          await showSubmittedData(data);
          setIsLoading(false);
        })}
        className="space-y-8"
      >
        {/* Notification Types */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">
              {t('settings.notifications.notifyMeAbout')}
            </h3>
          </div>

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="relative space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-y-0 space-x-3">
                      <FormControl>
                        <RadioGroupItem value="all" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t('settings.notifications.allNewMessages')}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-y-0 space-x-3">
                      <FormControl>
                        <RadioGroupItem value="mentions" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t('settings.notifications.directMessagesAndMentions')}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-y-0 space-x-3">
                      <FormControl>
                        <RadioGroupItem value="none" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t('settings.notifications.nothing')}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Email Notifications */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Mail className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">
              {t('settings.notifications.emailNotifications')}
            </h3>
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="communication_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('settings.notifications.communicationEmails')}
                    </FormLabel>
                    <FormDescription>
                      {t(
                        'settings.notifications.communicationEmailsDescription'
                      )}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('settings.notifications.marketingEmails')}
                    </FormLabel>
                    <FormDescription>
                      {t('settings.notifications.marketingEmailsDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="social_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('settings.notifications.socialEmails')}
                    </FormLabel>
                    <FormDescription>
                      {t('settings.notifications.socialEmailsDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="security_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('settings.notifications.securityEmails')}
                    </FormLabel>
                    <FormDescription>
                      {t('settings.notifications.securityEmailsDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Mobile Settings */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Smartphone className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">
              {t('settings.notifications.mobileSettings')}
            </h3>
          </div>

          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem className="relative flex flex-row items-start space-y-0 space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {t('settings.notifications.useDifferentSettingsForMobile')}
                  </FormLabel>
                  <FormDescription>
                    {t('settings.notifications.mobileSettingsDescription')}{' '}
                    <Link
                      to="/settings"
                      className="underline decoration-dashed underline-offset-4 hover:decoration-solid"
                    >
                      {t('settings.notifications.mobileSettings')}
                    </Link>
                    .
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <LoadingButton
            type="submit"
            className="min-w-[100px]"
            isLoading={isLoading}
          >
            {t('common.save')}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
