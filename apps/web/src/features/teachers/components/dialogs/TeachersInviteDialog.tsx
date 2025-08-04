import { zodResolver } from '@hookform/resolvers/zod';
import { IconMailPlus, IconSend } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { useTeachersContext } from '../../TeachersContext';

import { LoadingButton } from '@/components/LoadingButton';
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

export function TeachersInviteDialog() {
  const { t } = useTranslation();
  const { setOpenedDialog } = useTeachersContext();

  const formSchema = z.object({
    email: z.string().email().min(1),
  });

  type TeacherInviteForm = z.infer<typeof formSchema>;

  const form = useForm<TeacherInviteForm>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: { email: '' },
  });

  const sendInvitationEmailMutation = useMutation(
    trpc.auth.sendInvitationEmail.mutationOptions({
      onSuccess: () => {
        toast.success(t('dialogs.invite.successTeacher'));
        form.reset();
        setOpenedDialog(null);
      },
      onError: () => {},
    })
  );

  function onSubmit(values: TeacherInviteForm) {
    sendInvitationEmailMutation.mutate({
      email: values.email,
      userType: 'user',
    });
  }

  return (
    <Dialog
      open
      onOpenChange={() => {
        form.reset();
        setOpenedDialog(null);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <IconMailPlus /> {t('dialogs.invite.titleTeacher')}
          </DialogTitle>
          <DialogDescription>
            {t('teachers.inviteDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="teacher-invite-form"
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
          </form>
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline">{t('dialogs.invite.form.cancel')}</Button>
          </DialogClose>
          <LoadingButton
            type="submit"
            form="teacher-invite-form"
            isLoading={sendInvitationEmailMutation.isPending}
          >
            {t('dialogs.invite.form.invite')} <IconSend />
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
