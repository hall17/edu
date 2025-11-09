import { PlusIcon, XIcon } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useParentsContext } from '../ParentsContext';

import { ParentsStudentsEnrollmentDialog } from './dialogs/ParentsStudentsEnrollmentDialog';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ParentsStudentsSectionProps {
  students: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    nationalId?: string | null;
    profilePictureUrl?: string | null;
  }>;
}

export function ParentsStudentsSection({
  students,
}: ParentsStudentsSectionProps) {
  const { t } = useTranslation();
  const { openedDialog, setOpenedDialog } = useParentsContext();
  const { setValue, watch } = useFormContext();

  const currentStudentIds = watch('studentIds') || [];

  function handleAddStudent() {
    setOpenedDialog('enrollStudents');
  }

  function handleRemoveStudent(studentId: string) {
    const updatedStudentIds = currentStudentIds.filter(
      (id: string) => id !== studentId
    );
    setValue('studentIds', updatedStudentIds);
  }

  function handleAssignStudentFromDialog(studentId: string) {
    if (!currentStudentIds.includes(studentId)) {
      setValue('studentIds', [...currentStudentIds, studentId]);
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="border-border border-b pb-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-base font-semibold capitalize">
              {t('parents.students.title')}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddStudent}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              {t('parents.students.addStudent')}
            </Button>
          </div>

          {students.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              {t('parents.students.noStudents')}
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="border-border flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveStudent(student.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">
                      {t('parents.students.removeStudent')}
                    </span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {openedDialog === 'enrollStudents' && (
        <ParentsStudentsEnrollmentDialog
          onAssignStudent={handleAssignStudentFromDialog}
          currentStudentIds={currentStudentIds}
        />
      )}
    </>
  );
}
