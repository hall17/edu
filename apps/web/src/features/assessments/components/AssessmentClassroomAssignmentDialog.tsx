import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2Icon, School } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useDebounceCallback } from 'usehooks-ts';

import { useAssessmentsContext } from '../AssessmentsContext';

import { AssessmentClassroomAssignmentFormDialog } from './AssessmentClassroomAssignmentFormDialog';

import { LoadingButton } from '@/components';
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { trpc } from '@/lib/trpc';

export function AssessmentClassroomAssignmentDialog() {
  const { t } = useTranslation();
  const { setOpenedDialog, currentRow, assessmentsQuery } =
    useAssessmentsContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState<{
    integrationId: string;
    name: string;
  } | null>(null);

  const debouncedSetSearchQuery = useDebounceCallback(setSearchQuery, 200);

  // Extract subject and curriculum IDs from the current assessment
  const subjectIds = currentRow?.subject ? [currentRow.subject.id] : undefined;
  const curriculumIds =
    currentRow?.curriculums?.map((c) => c.curriculumId) || undefined;

  const classroomsQuery = useQuery(
    trpc.classroom.findAll.queryOptions({
      q: searchQuery,
      page: 1,
      size: 50,
      subjectIds,
      curriculumIds,
    })
  );

  function handleAssign(classroomIntegrationId: string, classroomName: string) {
    setSelectedClassroom({
      integrationId: classroomIntegrationId,
      name: classroomName,
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

  function handleFormDialogClose() {
    setSelectedClassroom(null);
  }

  return (
    <>
      <CommandDialog
        open
        onOpenChange={handleOpenChange}
        title={t('assessments.classroomAssignment.title')}
        description={t('assessments.classroomAssignment.description')}
        commandProps={{
          shouldFilter: false,
        }}
      >
        <CommandInput
          placeholder={t('assessments.classroomAssignment.searchPlaceholder')}
          onValueChange={debouncedSetSearchQuery}
        />

        <CommandList>
          {classroomsQuery.isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2Icon className="animate-spin" />
            </div>
          ) : (
            <CommandGroup
              heading={t('assessments.classroomAssignment.availableClassrooms')}
            >
              {classroomsQuery.data?.classrooms?.map((classroom) => {
                // Get the first integration (subject-based) for this classroom that matches the assessment
                const integration = classroom.integrations?.find(
                  (int) => int.subjectId === currentRow?.subject?.id
                );

                return (
                  <CommandItem
                    key={classroom.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                        <School className="text-primary h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{classroom.name}</span>
                        {classroom.branch && (
                          <span className="text-muted-foreground text-sm">
                            {classroom.branch.name}
                          </span>
                        )}
                        <span className="text-muted-foreground text-xs">
                          {t('common.capacity')}: {classroom.capacity}
                        </span>
                      </div>
                    </div>
                    <LoadingButton
                      size="sm"
                      variant={!integration ? 'secondary' : 'default'}
                      disabled={!integration}
                      onClick={() =>
                        integration &&
                        handleAssign(integration.id, classroom.name)
                      }
                    >
                      {!integration
                        ? t('assessments.classroomAssignment.noIntegration')
                        : t('assessments.classroomAssignment.assign')}
                    </LoadingButton>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>

      {selectedClassroom && (
        <AssessmentClassroomAssignmentFormDialog
          open={!!selectedClassroom}
          onOpenChange={handleFormDialogClose}
          classroomIntegrationId={selectedClassroom.integrationId}
          classroomName={selectedClassroom.name}
        />
      )}
    </>
  );
}
