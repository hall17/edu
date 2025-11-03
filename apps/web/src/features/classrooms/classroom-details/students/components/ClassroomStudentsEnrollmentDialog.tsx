import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useDebounceCallback } from 'usehooks-ts';

import { useClassroomDetailsContext } from '../../ClassroomDetailsContext';
import { useClassroomStudentsContext } from '../ClassroomStudentsContext';

import { LoadingButton } from '@/components';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { trpc } from '@/lib/trpc';

export function ClassroomStudentsEnrollmentDialog() {
  const { t } = useTranslation();
  const {
    setOpenedDialog,
    searchQuery,
    setSearchQuery,
    searchStudentsQuery,
    classroomId,
    studentsQuery,
  } = useClassroomStudentsContext();
  const { classroomQuery } = useClassroomDetailsContext();

  const [enrollingStudentId, setEnrollingStudentId] = useState<string | null>(
    null
  );

  const debouncedSetSearchQuery = useDebounceCallback(setSearchQuery, 200);

  const enrollMutation = useMutation(
    trpc.classroom.enrollStudent.mutationOptions({
      onSuccess: () => {
        toast.success(t('students.enrollment.success'));
        studentsQuery.refetch();
        classroomQuery.refetch();
        setEnrollingStudentId(null);
      },
      onError: (error) => {
        toast.error(error.message);
        setEnrollingStudentId(null);
      },
    })
  );

  function handleEnroll(studentId: string) {
    setEnrollingStudentId(studentId);
    enrollMutation.mutate({
      classroomId,
      studentId,
    });
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
      title={t('students.enrollment.title')}
      description={t('students.enrollment.description')}
      commandProps={{
        shouldFilter: false,
      }}
    >
      <CommandInput
        placeholder={t('students.enrollment.searchPlaceholder')}
        onValueChange={debouncedSetSearchQuery}
      />

      <CommandList>
        {searchStudentsQuery.isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2Icon className="animate-spin" />
          </div>
        ) : (
          <CommandGroup heading={t('students.enrollment.availableStudents')}>
            {searchStudentsQuery.data?.students?.map((student) => {
              const enrolled = studentsQuery.data?.students.some(
                (s) => s.student.id === student.id
              );

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
                    variant={enrolled ? 'secondary' : 'default'}
                    disabled={enrolled || enrollMutation.isPending}
                    isLoading={
                      enrollingStudentId === student.id &&
                      enrollMutation.isPending
                    }
                    onClick={() => !enrolled && handleEnroll(student.id)}
                  >
                    {enrolled
                      ? t('students.enrollment.alreadyEnrolled')
                      : t('students.enrollment.enroll')}
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
