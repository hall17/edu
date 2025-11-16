import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { z } from 'zod';

import countries from '@/assets/countries.json';
import edusama from '@/assets/edusama.png';
import edusamaLogin from '@/assets/edusama_login.png';
import { LoadingButton } from '@/components';
import { PasswordInput } from '@/components/PasswordInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import i18n from '@/lib/i18n';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/stores/authStore';

export function Login() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/(auth)/login' }) as { redirect?: string };
  const { t } = useTranslation();
  const loginMutation = useMutation(trpc.auth.login.mutationOptions());
  const { user, setUser } = useAuth();

  const formSchema = z.object({
    email: z.email({
      error: (iss) =>
        iss.input === '' ? t('common.pleaseEnterYourEmail') : undefined,
    }),
    password: z
      .string()
      .min(1, i18n.t('auth.pleaseEnterYourPassword'))
      .min(
        3,
        i18n.t('auth.passwordMustBeAtLeastXCharactersLong', { count: 3 })
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      const country = countries.find(
        (country) => country.iso2 === response?.countryCode
      );

      setUser({ ...response, country: country || null });

      // All users redirect to root, layout adapts based on user type
      const redirectPath = search.redirect || '/';
      setTimeout(() => navigate({ to: redirectPath }), 0);
    } catch {}
  }
  return (
    <div className="relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src={edusama} className="w-[150px]" alt="Edusama" />
        </div>

        <img src={edusamaLogin} className="relative m-auto" alt="Edusama" />
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <img src={edusama} className="my-2 w-[250px]" alt="Edusama" />

          <div className="flex flex-col gap-2 text-left">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('auth.title')}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t('auth.description')}
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.email')}</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>{t('auth.password')}</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                    <Link
                      to="/forgot-password"
                      className="text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75"
                    >
                      {t('auth.forgotPassword')}
                    </Link>
                  </FormItem>
                )}
              />
              <LoadingButton
                className="mt-2"
                disabled={loginMutation.isPending}
                isLoading={loginMutation.isPending}
              >
                {t('auth.loginButton')}
              </LoadingButton>
            </form>
          </Form>
          <p className="text-muted-foreground px-8 text-center text-sm">
            <Trans
              i18nKey="auth.acceptTerms"
              components={{
                1: (
                  <a
                    href="/terms"
                    className="hover:text-primary underline underline-offset-4"
                  />
                ),
                2: (
                  <a
                    href="/privacy"
                    className="hover:text-primary underline underline-offset-4"
                  />
                ),
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}
