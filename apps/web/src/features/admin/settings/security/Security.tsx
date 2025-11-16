import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Shield, Key } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { LoadingButton, PasswordInput } from '@/components';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/lib/trpc';

export function SettingsSecurity() {
  const { t } = useTranslation();
  const updateMeMutation = useMutation(trpc.auth.updateMe.mutationOptions());

  const changePasswordFormSchema = z
    .object({
      password: z.string().min(3).max(255),
      confirmPassword: z.string().min(3).max(255),
    })
    .refine(
      (data) => {
        return data.password === data.confirmPassword;
      },
      {
        message: t('common.passwordsDoNotMatch'),
        path: ['confirmPassword'],
      }
    );

  type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  async function onSubmit(data: ChangePasswordFormValues) {
    try {
      await updateMeMutation.mutateAsync({
        password: data.password,
      });
      toast.success(t('settings.profile.form.updateProfileSuccess'));
    } catch {}
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
            <Shield className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {t('settings.security.title')}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t('settings.security.description')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Change Password */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Key className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  {t('settings.security.resetPasswordTitle')}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('settings.profile.form.password')}
                      </FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="********" {...field} />
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
                      <FormLabel>
                        {t('settings.profile.form.confirmPassword')}
                      </FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-end gap-2">
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
