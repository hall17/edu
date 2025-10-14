import { Language, Theme } from '@edusama/server';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { detailedDiff } from 'deep-object-diff';
import { Settings, Monitor, Globe, Bell } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { LoadingButton } from '@/components';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/ThemeContext';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/stores/authStore';

const preferencesFormSchema = z
  .object({
    theme: z.enum(Theme),
    language: z.enum(Language),
    notificationsEnabled: z.boolean(),
  })
  .partial();

type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

export function SettingsPreferences() {
  const { t, i18n } = useTranslation();
  const { setTheme } = useTheme();
  const { user, setUserPreferences } = useAuth();
  const updateUserPreferencesMutation = useMutation(
    trpc.auth.updateUserPreferences.mutationOptions()
  );

  const defaultValues: Partial<PreferencesFormValues> = {
    theme: user?.preferences.theme ?? 'LIGHT',
    language: user?.preferences.language ?? 'TR',
    notificationsEnabled: user?.preferences.notificationsEnabled,
  };

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues,
  });

  async function onSubmit(data: PreferencesFormValues) {
    try {
      const diff = detailedDiff(defaultValues, data);

      if (!Object.keys(diff.updated).length) {
        return;
      }

      const updatedValues = diff.updated as Partial<PreferencesFormValues>;

      if (updatedValues.theme) {
        setTheme(updatedValues.theme);
      }

      if (updatedValues.language) {
        i18n.changeLanguage(updatedValues.language.toLowerCase());
      }

      setUserPreferences({
        ...user?.preferences,
        ...diff.updated,
      });

      await updateUserPreferencesMutation.mutateAsync(diff.updated);

      toast.success(t('settings.preferences.preferencesUpdated'));
    } catch {}
  }

  return (
    // <div className="container mx-auto space-y-6 overflow-y-auto">
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
            <Settings className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {t('settings.preferences.title')}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t('settings.preferences.description')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* <FormField
            control={form.control}
            name="font"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font</FormLabel>
                <div className="relative w-max">
                  <FormControl>
                    <select
                      className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'w-[200px] appearance-none font-normal capitalize',
                        'dark:bg-background dark:hover:bg-background'
                      )}
                      {...field}
                    >
                      {fonts.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <ChevronDownIcon className="absolute top-2.5 right-3 h-4 w-4 opacity-50" />
                </div>
                <FormDescription className="font-manrope">
                  Set the font you want to use in the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
              /> */}
            {/* Language Settings */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  {t('settings.preferences.language')}
                </h3>
              </div>

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      {t('settings.preferences.language')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[250px]">
                          <SelectValue
                            placeholder={t(
                              'settings.preferences.selectLanguage'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Language).map((language) => (
                          <SelectItem key={language} value={language}>
                            {t(`languages.${language}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            {/* Theme Settings */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Monitor className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  {t('settings.preferences.theme')}
                </h3>
              </div>

              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>{t('settings.preferences.theme')}</FormLabel>
                    <FormDescription>
                      {t('settings.preferences.themeDescription')}
                    </FormDescription>
                    <FormMessage />
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid max-w-md grid-cols-2 gap-8 pt-2"
                    >
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem
                              value={Theme.LIGHT}
                              className="sr-only"
                            />
                          </FormControl>
                          <div className="border-muted hover:border-accent items-center rounded-md border-2 p-1">
                            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                              <div className="space-y-2 rounded-md bg-white p-2 shadow-xs">
                                <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                              </div>
                              <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                                <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                              </div>
                              <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                                <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                              </div>
                            </div>
                          </div>
                          <span className="block w-full p-2 text-center font-normal">
                            {t(`themes.${Theme.LIGHT}`)}
                          </span>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem
                              value={Theme.DARK}
                              className="sr-only"
                            />
                          </FormControl>
                          <div className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground items-center rounded-md border-2 p-1">
                            <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                              <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-xs">
                                <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                              </div>
                              <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
                                <div className="h-4 w-4 rounded-full bg-slate-400" />
                                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                              </div>
                              <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
                                <div className="h-4 w-4 rounded-full bg-slate-400" />
                                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                              </div>
                            </div>
                          </div>
                          <span className="block w-full p-2 text-center font-normal">
                            {t(`themes.${Theme.DARK}`)}
                          </span>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Notification Settings */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <Bell className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  {t('settings.preferences.notifications')}
                </h3>
              </div>

              <FormField
                control={form.control}
                name="notificationsEnabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('settings.preferences.notifications')}
                    </FormLabel>
                    <FormDescription>
                      {t('settings.preferences.notificationsDescription')}
                    </FormDescription>
                    <FormMessage />
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
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
                isLoading={updateUserPreferencesMutation.isPending}
              >
                {t('common.save')}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
    // </div>
  );
}
