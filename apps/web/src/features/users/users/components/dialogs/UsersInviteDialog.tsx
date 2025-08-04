import { zodResolver } from '@hookform/resolvers/zod';
import { IconMailPlus, IconSend } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useUsersContext } from '../../UsersContext';

import { MultiSelect } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
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
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/stores/authStore';

export function UsersInviteDialog() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { roles, setOpenedDialog } = useUsersContext();

  const filteredRoles = useMemo(() => {
    if (user?.isSuperAdmin) {
      return roles;
    } else if (user?.isAdmin) {
      return roles.filter((role) => role.code !== 'superAdmin');
    } else {
      return roles.filter(
        (role) => role.code !== 'superAdmin' && role.code !== 'admin'
      );
    }
  }, [roles, user]);

  const formSchema = z.object({
    email: z.string().email().min(1),
    roleIds: z.array(z.string()).optional(),
  });

  type UserInviteForm = z.infer<typeof formSchema>;

  const form = useForm<UserInviteForm>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: { email: '', roleIds: [] },
  });

  const sendInvitationEmailMutation = useMutation(
    trpc.auth.sendInvitationEmail.mutationOptions({
      onSuccess: () => {
        toast.success(t('dialogs.invite.successUser'));
        form.reset();
        setOpenedDialog(null);
      },
      onError: () => {},
    })
  );

  function onSubmit(values: UserInviteForm) {
    sendInvitationEmailMutation.mutate({
      email: values.email,
      userType: 'user',
      roleIds: values.roleIds,
    });
  }

  function handleCloseDialog() {
    form.reset();
    setOpenedDialog(null);
  }

  return (
    <Dialog open onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <IconMailPlus /> {t('dialogs.invite.titleUser')}
          </DialogTitle>
          <DialogDescription>
            {t('users.inviteDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="user-invite-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dialogs.invite.form.email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('dialogs.invite.placeholders.email')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleIds"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>{t('users.inviteDialog.form.roles')}</FormLabel>
                  <MultiSelect
                    options={
                      filteredRoles.map((role) => ({
                        label: role.name,
                        value: role.id,
                      })) || []
                    }
                    onValueChange={field.onChange}
                    placeholder={t('users.inviteDialog.placeholders.roles')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline">{t('dialogs.invite.form.cancel')}</Button>
          </DialogClose>
          <Button type="submit" form="user-invite-form">
            {t('dialogs.invite.form.invite')} <IconSend />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
