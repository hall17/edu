import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import countries from '@/assets/countries.json';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useStudentsContext } from '@/features/admin/students/StudentsContext';
import { Student } from '@/lib/trpc';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { getStatusBadgeVariant } from '@/utils';

export function StudentsViewDialog() {
  const { t } = useTranslation();
  const { updateStudentSignupStatus, setOpenedDialog, currentRow } =
    useStudentsContext();
  const country = countries.find(
    (country) => country.iso2 === currentRow.countryCode
  );
  const [approvalNote, setApprovalNote] = useState('');

  const updateSignupStatusMutation = useMutation(
    trpc.student.updateSignupStatus.mutationOptions({
      onSuccess: (student) => {
        toast.success(t('students.actionDialog.approval.successMessage'));
        setApprovalNote('');
        setOpenedDialog(null);
        updateStudentSignupStatus(student.id, student.status);
        // The student list will be refreshed automatically via the context
      },
      onError: (error) => {
        console.error('Failed to update signup status:', error);
        toast.error(t('students.actionDialog.approval.errorMessage'));
      },
    })
  );

  const shouldShowStatusUpdateInfo =
    currentRow.status === 'SUSPENDED' ||
    currentRow.status === 'REJECTED' ||
    currentRow.status === 'REQUESTED_CHANGES';

  function handleApprovalAction(
    status: 'ACTIVE' | 'REJECTED' | 'REQUESTED_CHANGES'
  ) {
    if (
      (status === 'REJECTED' || status === 'REQUESTED_CHANGES') &&
      !approvalNote.trim()
    ) {
      toast.error(t('students.actionDialog.approval.noteRequired'));
      return;
    }

    updateSignupStatusMutation.mutate({
      id: currentRow.id,
      status,
      statusUpdateReason: approvalNote.trim() || undefined,
    });
  }

  function handleApprove() {
    handleApprovalAction('ACTIVE');
  }

  function handleReject() {
    handleApprovalAction('REJECTED');
  }

  function handleRequestChanges() {
    handleApprovalAction('REQUESTED_CHANGES');
  }

  return (
    <Dialog open onOpenChange={() => setOpenedDialog(null)}>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {t('dialogs.view.title', {
              entity: t('sidebar.navigation.students'),
            })}
          </DialogTitle>
          <DialogDescription>{t('dialogs.view.description')}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={currentRow.profilePictureUrl || undefined}
                  alt={`${currentRow.firstName} ${currentRow.lastName}`}
                  className="object-contain"
                />
                <AvatarFallback>
                  {`${currentRow.firstName.charAt(0)}${currentRow.lastName.charAt(0)}`.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {currentRow.firstName} {currentRow.lastName}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentRow.email}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant={getStatusBadgeVariant(currentRow.status)}
                    className="capitalize"
                  >
                    {t(`studentStatuses.${currentRow.status}`)}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div>
              <h4 className="mb-3 text-sm font-medium">
                {t('dialogs.view.sections.personalInformation')}
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.fullName')}
                  </label>
                  <p className="text-sm">
                    {currentRow.firstName} {currentRow.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.nationalId')}
                  </label>
                  <p className="text-sm">{currentRow.nationalId || '-'}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.gender')}
                  </label>
                  <p className="text-sm">
                    {currentRow.gender
                      ? t(`genders.${currentRow.gender}`)
                      : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.dateOfBirth')}
                  </label>
                  <p className="text-sm">
                    {currentRow.dateOfBirth
                      ? dayjs(currentRow.dateOfBirth).format('DD/MM/YYYY')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h4 className="mb-3 text-sm font-medium">
                {t('dialogs.view.sections.contactInformation')}
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.email')}
                  </label>
                  <p className="overflow-x-hidden text-sm overflow-ellipsis">
                    {currentRow.email}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.phoneNumber')}
                  </label>
                  <p className="text-sm">
                    +{country?.phoneCode ?? ''} {currentRow.phoneNumber || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.country')}
                  </label>
                  <p className="text-sm">
                    {country
                      ? t(`countries.${country.iso2}`, {
                          defaultValue: country.name,
                        })
                      : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.city')}
                  </label>
                  <p className="text-sm">{currentRow.city || '-'}</p>
                </div>
                {currentRow.state && (
                  <div>
                    <label className="text-muted-foreground text-xs font-medium">
                      {t('dialogs.view.fields.state')}
                    </label>
                    <p className="text-sm">{currentRow.state}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.address')}
                  </label>
                  <p className="text-sm">{currentRow.address || '-'}</p>
                </div>
                {currentRow.zipCode && (
                  <div>
                    <label className="text-muted-foreground text-xs font-medium">
                      {t('dialogs.view.fields.zipCode')}
                    </label>
                    <p className="text-sm">{currentRow.zipCode}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(currentRow.facebookLink ||
              currentRow.twitterLink ||
              currentRow.instagramLink ||
              currentRow.linkedinLink) && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-3 text-sm font-medium">
                    {t('dialogs.view.sections.socialLinks')}
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {currentRow.facebookLink && (
                      <div>
                        <label className="text-muted-foreground text-xs font-medium">
                          {t('dialogs.view.fields.facebookLink')}
                        </label>
                        <p className="truncate text-sm">
                          <a
                            href={currentRow.facebookLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {currentRow.facebookLink}
                          </a>
                        </p>
                      </div>
                    )}
                    {currentRow.twitterLink && (
                      <div>
                        <label className="text-muted-foreground text-xs font-medium">
                          {t('dialogs.view.fields.twitterLink')}
                        </label>
                        <p className="truncate text-sm">
                          <a
                            href={currentRow.twitterLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {currentRow.twitterLink}
                          </a>
                        </p>
                      </div>
                    )}
                    {currentRow.instagramLink && (
                      <div>
                        <label className="text-muted-foreground text-xs font-medium">
                          {t('dialogs.view.fields.instagramLink')}
                        </label>
                        <p className="truncate text-sm">
                          <a
                            href={currentRow.instagramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {currentRow.instagramLink}
                          </a>
                        </p>
                      </div>
                    )}
                    {currentRow.linkedinLink && (
                      <div>
                        <label className="text-muted-foreground text-xs font-medium">
                          {t('dialogs.view.fields.linkedinLink')}
                        </label>
                        <p className="truncate text-sm">
                          <a
                            href={currentRow.linkedinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {currentRow.linkedinLink}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Approval Section - Only show for REQUESTED_APPROVAL status */}
            {currentRow.status === 'REQUESTED_APPROVAL' && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-3 text-sm font-medium">
                    {t('students.viewDialog.sections.approval')}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-muted-foreground mb-2 block text-xs font-medium">
                        {t('students.actionDialog.approval.noteLabel')}
                      </label>
                      <Textarea
                        placeholder={t(
                          'students.actionDialog.approval.notePlaceholder'
                        )}
                        value={approvalNote}
                        onChange={(e) => setApprovalNote(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <p className="text-muted-foreground mt-1 text-xs">
                        {t('students.actionDialog.approval.noteHint')}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={handleApprove}
                        disabled={updateSignupStatusMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {updateSignupStatusMutation.isPending
                          ? t('students.actionDialog.approval.processing')
                          : t('students.actionDialog.approval.approve')}
                      </Button>

                      <Button
                        onClick={handleRequestChanges}
                        disabled={
                          updateSignupStatusMutation.isPending ||
                          !approvalNote.trim()
                        }
                        variant="outline"
                        className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                      >
                        {t('students.actionDialog.approval.requestChanges')}
                      </Button>

                      <Button
                        onClick={handleReject}
                        disabled={
                          updateSignupStatusMutation.isPending ||
                          !approvalNote.trim()
                        }
                        variant="destructive"
                      >
                        {t('students.actionDialog.approval.reject')}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* System Information */}
            <Separator />
            <div>
              <h4 className="mb-3 text-sm font-medium">
                {t('dialogs.view.sections.accountInformation')}
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.createdAt')}
                  </label>
                  <p className="text-sm">
                    {dayjs(currentRow.createdAt).format('DD/MM/YYYY')}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.lastUpdatedAt')}
                  </label>
                  <p className="text-sm">
                    {dayjs(currentRow.updatedAt).format('DD/MM/YYYY')}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-medium">
                    {t('dialogs.view.fields.status')}
                  </label>
                  <p className="text-sm capitalize">
                    {t(`studentStatuses.${currentRow.status}`)}
                  </p>
                </div>
                {shouldShowStatusUpdateInfo && currentRow.statusUpdatedAt && (
                  <div>
                    <label className="text-muted-foreground text-xs font-medium">
                      {t('dialogs.view.fields.statusUpdatedAt')}
                    </label>
                    <p className="text-sm">
                      {dayjs(currentRow.statusUpdatedAt).format('DD/MM/YYYY')}
                    </p>
                  </div>
                )}
                {shouldShowStatusUpdateInfo &&
                  currentRow.statusUpdateReason && (
                    <div className="md:col-span-2">
                      <label className="text-muted-foreground text-xs font-medium">
                        {t('dialogs.view.fields.statusUpdateReason')}
                      </label>
                      <p className="text-sm">{currentRow.statusUpdateReason}</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
