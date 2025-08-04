import dayjs from 'dayjs';
import { Edit, Eye, Plus, Search, X } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useClassroomDetailsContext } from '../ClassroomDetailsContext';

import {
  ClassroomSessionsProvider,
  useClassroomSessionsContext,
} from './ClassroomSessionsContext';
import { ClassroomSessionDialogs } from './dialogs';

import { Loading, MultiSelect, SearchInput } from '@/components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';

function ClassroomSessionsContent() {
  const { t } = useTranslation();

  const {
    setCurrentRow,
    setOpenedDialog,
    searchFilters,
    setFilters,
    classroomIntegrationSessions,
    pagination,
    classroomIntegrationSessionsQuery,
  } = useClassroomSessionsContext();
  const { classroom } = useClassroomDetailsContext();

  // Get available subjects for filtering
  const availableSubjects = classroom?.integrations
    .filter((integration) => integration.subject)
    .map((integration) => integration.subject);

  // Get unique subjects
  const uniqueSubjects = availableSubjects?.filter(
    (subject, index, array) =>
      array.findIndex((s) => s?.id === subject?.id) === index
  );

  if (classroomIntegrationSessionsQuery.isPending) {
    return <Loading className="h-[500px]" />;
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('classrooms.sessions.title')}</CardTitle>
                <CardDescription>
                  {t('classrooms.sessions.description')}
                </CardDescription>
              </div>
              <Button
                onClick={() => setOpenedDialog('create')}
                className="ml-4"
              >
                <Plus className="mr-2 size-4" />
                {t('classrooms.sessions.addNew')}
              </Button>
            </div>

            {/* Filtering Controls */}
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                {/* Search Input */}
                <SearchInput
                  placeholder={t('classrooms.sessions.search.placeholder')}
                  value={searchFilters.q || ''}
                  onChange={(value: string) => setFilters({ q: value })}
                  onClear={() => setFilters({ q: '' })}
                />

                {/* Subject Filter */}
                <MultiSelect
                  className="!w-[250px]"
                  placeholder={t('classrooms.sessions.filters.subject')}
                  options={
                    uniqueSubjects?.map((subject) => ({
                      label: subject!.name,
                      value: subject!.id,
                    })) || []
                  }
                  defaultValue={searchFilters.subjectIds}
                  onValueChange={(value) => {
                    setFilters({
                      subjectIds: value.length === 0 ? undefined : value,
                    });
                  }}
                />
                {Object.keys(searchFilters).length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilters({
                        q: undefined,
                        subjectIds: undefined,
                        page: undefined,
                      });
                    }}
                  >
                    {t('common.resetFilters')}
                  </Button>
                )}
              </div>

              {/* Pagination Info and Reset Filters */}
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  {pagination ? (
                    <>
                      {t('common.pagination.showing')}{' '}
                      {(pagination.page - 1) * pagination.size + 1}-
                      {Math.min(
                        pagination.page * pagination.size,
                        pagination.count
                      )}{' '}
                      {t('common.pagination.of')} {pagination.count}{' '}
                      {t('common.pagination.results')}
                    </>
                  ) : classroomIntegrationSessions?.length ? (
                    <>
                      {t('common.pagination.showing')}{' '}
                      {classroomIntegrationSessions.length}{' '}
                      {t('common.pagination.results')}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </CardHeader>
          {classroomIntegrationSessionsQuery.isPending ? (
            <Loading className="h-[500px]" />
          ) : (
            <>
              <CardContent>
                {classroomIntegrationSessions?.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center">
                    {t('classrooms.sessions.noSessionsFound')}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      {classroomIntegrationSessions?.map((session) => {
                        // Calculate attendance statistics
                        const totalStudents =
                          session.attendanceRecords?.length || 0;
                        const presentStudents =
                          session.attendanceRecords?.filter(
                            (record: any) => record.status === 'PRESENT'
                          ).length || 0;
                        const attendancePercentage =
                          totalStudents > 0
                            ? (presentStudents / totalStudents) * 100
                            : 0;

                        return (
                          <Card
                            key={session.id}
                            className="transition-shadow hover:shadow-md"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-3">
                                  {/* Header with date */}
                                  <div className="space-y-1">
                                    <h3 className="text-lg font-semibold">
                                      {dayjs(session.startDate).format(
                                        'DD MMMM YYYY'
                                      )}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                      {dayjs(session.startDate).format('HH:mm')}{' '}
                                      - {dayjs(session.endDate).format('HH:mm')}
                                    </p>
                                  </div>

                                  {/* Teacher and Subject */}
                                  <div className="space-y-2">
                                    {session.teacher && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground text-sm font-medium">
                                          {t(
                                            'classrooms.sessions.labels.teacher'
                                          )}
                                          :
                                        </span>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {session.teacher.firstName}{' '}
                                          {session.teacher.lastName}
                                        </Badge>
                                      </div>
                                    )}

                                    {session.classroomIntegration?.subject && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground text-sm font-medium">
                                          {t(
                                            'classrooms.sessions.labels.subject'
                                          )}
                                          :
                                        </span>
                                        <Badge variant="outline">
                                          {
                                            session.classroomIntegration.subject
                                              .name
                                          }
                                        </Badge>
                                      </div>
                                    )}

                                    {session.lessons &&
                                      session.lessons.length > 0 && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-muted-foreground text-sm font-medium">
                                            {t(
                                              'classrooms.sessions.labels.lessons'
                                            )}
                                            :
                                          </span>
                                          <div className="flex flex-wrap gap-1">
                                            {session.lessons.map(
                                              (lessonItem) => (
                                                <Badge
                                                  key={lessonItem.lesson.id}
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  {lessonItem.lesson.name}
                                                </Badge>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>

                                  {/* Attendance Progress */}
                                  {totalStudents > 0 ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          {/* Color-coded indicator */}
                                          <div
                                            className={`size-3 rounded-full ${
                                              attendancePercentage >= 80
                                                ? 'bg-green-500'
                                                : attendancePercentage >= 60
                                                  ? 'bg-yellow-500'
                                                  : 'bg-red-500'
                                            }`}
                                          />
                                          <span className="text-sm font-medium">
                                            {t(
                                              'classrooms.sessions.labels.attendance'
                                            )}
                                          </span>
                                        </div>
                                        <span className="text-muted-foreground text-sm">
                                          {presentStudents}/{totalStudents}{' '}
                                          {t(
                                            'classrooms.sessions.labels.students'
                                          )}{' '}
                                          ({Math.round(attendancePercentage)}%)
                                        </span>
                                      </div>
                                      <Progress
                                        value={attendancePercentage}
                                        variant={
                                          attendancePercentage >= 80
                                            ? 'success'
                                            : attendancePercentage >= 60
                                              ? 'warning'
                                              : 'destructive'
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <div className="size-3 rounded-full bg-gray-400" />
                                      <span className="text-muted-foreground text-sm">
                                        {t(
                                          'classrooms.sessions.labels.noAttendanceRecord'
                                        )}
                                      </span>
                                    </div>
                                  )}

                                  {/* Description */}
                                  {session.description && (
                                    <div className="border-t pt-2">
                                      <div className="text-muted-foreground mb-1 text-sm font-medium">
                                        {t(
                                          'classrooms.sessions.labels.description'
                                        )}
                                        :
                                      </div>
                                      <p className="text-muted-foreground text-sm">
                                        {session.description}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="ml-4 flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setCurrentRow(session as any);
                                      setOpenedDialog('view');
                                    }}
                                  >
                                    <Eye className="mr-2 size-4" />
                                    {t('classrooms.sessions.actions.view')}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setCurrentRow(session as any);
                                      setOpenedDialog('edit');
                                    }}
                                  >
                                    <Edit className="mr-2 size-4" />
                                    {t('classrooms.sessions.actions.edit')}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    {/* Pagination Controls */}
                    {pagination && (
                      <div className="px-6">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => {
                                  if (pagination.page > 1) {
                                    setFilters({ page: pagination.page - 1 });
                                  }
                                }}
                                className={
                                  pagination.page <= 1
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                                }
                              />
                            </PaginationItem>

                            {Array.from(
                              { length: pagination.totalPages },
                              (_, i) => i + 1
                            )
                              .filter((page) => {
                                const currentPage = pagination.page;
                                const totalPages = pagination.totalPages;

                                // Show first page, last page, current page, and pages around current
                                return (
                                  page === 1 ||
                                  page === totalPages ||
                                  Math.abs(page - currentPage) <= 1
                                );
                              })
                              .map((page, index, array) => {
                                // Add ellipsis for gaps
                                const prevPage = array[index - 1];
                                const showEllipsis =
                                  prevPage && page - prevPage > 1;

                                return (
                                  <React.Fragment key={page}>
                                    {showEllipsis && (
                                      <PaginationItem>
                                        <span className="px-3 py-2">...</span>
                                      </PaginationItem>
                                    )}
                                    <PaginationItem>
                                      <PaginationLink
                                        onClick={() => setFilters({ page })}
                                        isActive={pagination.page === page}
                                        className="cursor-pointer"
                                      >
                                        {page}
                                      </PaginationLink>
                                    </PaginationItem>
                                  </React.Fragment>
                                );
                              })}

                            <PaginationItem>
                              <PaginationNext
                                onClick={() => {
                                  if (pagination.page < pagination.totalPages) {
                                    setFilters({ page: pagination.page + 1 });
                                  }
                                }}
                                className={
                                  pagination.page >= pagination.totalPages
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </>
          )}
        </Card>
      </div>

      <ClassroomSessionDialogs />
    </>
  );
}

export function ClassroomSessions() {
  return (
    <ClassroomSessionsProvider>
      <ClassroomSessionsContent />
    </ClassroomSessionsProvider>
  );
}
