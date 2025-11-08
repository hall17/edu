import { Loader2Icon } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useDebounceCallback } from 'usehooks-ts';

import { useParentsContext } from '../../ParentsContext';

import { LoadingButton } from '@/components';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface ParentsStudentsEnrollmentDialogProps {
  onAssignStudent: (studentId: string) => void;
  currentStudentIds: string[];
}

export function ParentsStudentsEnrollmentDialog({
  onAssignStudent,
  currentStudentIds,
}: ParentsStudentsEnrollmentDialogProps) {
  const { t } = useTranslation();
  const { setOpenedDialog, searchQuery, setSearchQuery, searchStudentsQuery } =
    useParentsContext();
  const [assigningStudentId, setAssigningStudentId] = useState<string | null>(
    null
  );

  const debouncedSetSearchQuery = useDebounceCallback(setSearchQuery, 200);

  function handleAssign(studentId: string) {
    setAssigningStudentId(studentId);
    onAssignStudent(studentId);
    toast.success(t('parents.students.enrollment.success'));
    setAssigningStudentId(null);
  }

  function handleOpenChange(open: boolean) {
    setOpenedDialog(null);

    if (!open) {
      setTimeout(() => {
        setSearchQuery('');
      }, 100);
    }
  }

  return (
    <CommandDialog
      open
      onOpenChange={handleOpenChange}
      title={t('parents.students.enrollment.title')}
      description={t('parents.students.enrollment.description')}
      commandProps={{
        shouldFilter: false,
      }}
    >
      <CommandInput
        placeholder={t('parents.students.enrollment.searchPlaceholder')}
        onValueChange={debouncedSetSearchQuery}
      />

      <CommandList>
        {searchStudentsQuery.isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2Icon className="animate-spin" />
          </div>
        ) : (
          <CommandGroup
            heading={t('parents.students.enrollment.availableStudents')}
          >
            {searchStudentsQuery.data?.students?.map((student) => {
              const assigned = currentStudentIds.includes(student.id);

              return (
                <CommandItem
                  key={student.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex gap-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={student.profilePictureUrl || undefined}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="object-contain"
                      />
                      <AvatarFallback>
                        {`${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {student.email}
                      </span>
                      {student.nationalId && (
                        <span className="text-muted-foreground text-xs">
                          {t('common.nationalId')}: {student.nationalId}
                        </span>
                      )}
                    </div>
                  </div>
                  <LoadingButton
                    size="sm"
                    variant={assigned ? 'secondary' : 'default'}
                    disabled={assigned || assigningStudentId === student.id}
                    onClick={() => !assigned && handleAssign(student.id)}
                  >
                    {assigned
                      ? t('parents.students.enrollment.alreadyAssigned')
                      : t('parents.students.enrollment.assign')}
                  </LoadingButton>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
