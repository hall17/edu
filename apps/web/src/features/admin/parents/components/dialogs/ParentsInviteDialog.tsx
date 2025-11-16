import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { MailPlus, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

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
import { useParentsContext } from '@/features/admin/parents/ParentsContext';
import { trpc } from '@/lib/trpc';

export function ParentsInviteDialog() {
  const { setOpenedDialog } = useParentsContext();
  const { t } = useTranslation();

  const formSchema = z.object({
    email: z.string().email().min(1),
    description: z.string().optional(),
  });

  type ParentInviteForm = z.infer<typeof formSchema>;

  const form = useForm<ParentInviteForm>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: { email: '', description: '' },
  });

  const sendInvitationEmailMutation = useMutation(
    trpc.auth.sendInvitationEmail.mutationOptions({
      onSuccess: () => {
        toast.success(t('dialogs.invite.successParent'));
        form.reset();
        setOpenedDialog(null);
      },
      onError: () => {},
    })
  );

  function onSubmit(values: ParentInviteForm) {
    sendInvitationEmailMutation.mutate({
      email: values.email,
      userType: 'user',
    });
  }

  return (
    <Dialog
      open
      onOpenChange={(state) => {
        form.reset();
        setOpenedDialog(null);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <MailPlus /> {t('dialogs.invite.titleParent')}
          </DialogTitle>
          <DialogDescription>
            {t('parents.inviteDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="parent-invite-form"
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
            form="parent-invite-form"
            isLoading={sendInvitationEmailMutation.isPending}
          >
            {t('dialogs.invite.form.invite')} <Send />
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
