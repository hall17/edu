import { ModuleCode } from '@edusama/common';
import dayjs from 'dayjs';
import {
  Calendar,
  Clock,
  GraduationCap,
  Link,
  MapPin,
  Settings,
  Users,
  BookOpen,
  Bell,
  CheckCircle,
  Target,
  FileText,
  User,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useClassroomDetailsContext } from '../ClassroomDetailsContext';

import { Main } from '@/components/layout/Main';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ClassroomDetailsRoot() {
  const { t } = useTranslation();
  const { classroom } = useClassroomDetailsContext();

  if (!classroom) {
    return <div>Loading...</div>;
  }

  return (
    <Main>
      <div className="container mx-auto space-y-6 overflow-y-auto">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              {t('classrooms.viewDialog.basicInfo')}
            </CardTitle>
            <CardDescription>
              {t('classrooms.viewDialog.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <BookOpen className="text-muted-foreground h-4 w-4" />
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    {t('classrooms.table.name')}
                  </label>
                  <p className="text-sm">{classroom.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="text-muted-foreground h-4 w-4" />
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    {t('classrooms.table.description')}
                  </label>
                  <p className="text-sm">{classroom.description || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    {t('classrooms.table.startDate')}
                  </label>
                  <p className="text-sm">
                    {dayjs(classroom.startDate).format('DD/MM/YYYY')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    {t('classrooms.table.endDate')}
                  </label>
                  <p className="text-sm">
                    {dayjs(classroom.endDate).format('DD/MM/YYYY')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-muted-foreground h-4 w-4" />
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    {t('classrooms.table.capacity')}
                  </label>
                  <p className="text-sm">{classroom.capacity}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-muted-foreground h-4 w-4" />
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    {t('classrooms.viewDialog.totalStudents')}
                  </label>
                  <p className="text-sm">{classroom.students.length ?? '-'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-base font-semibold">
                <Target className="h-4 w-4" />
                {t('classrooms.viewDialog.passingScores')}
              </span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-muted-foreground h-4 w-4" />
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      {t('classrooms.viewDialog.attendancePass')}
                    </label>
                    <p className="text-sm">
                      {classroom.attendancePassPercentage}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-muted-foreground h-4 w-4" />
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      {t('classrooms.viewDialog.assessmentPass')}
                    </label>
                    <p className="text-sm">{classroom.assessmentScorePass}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-muted-foreground h-4 w-4" />
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      {t('classrooms.viewDialog.assignmentPass')}
                    </label>
                    <p className="text-sm">{classroom.assignmentScorePass}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-base font-semibold">
                <Bell className="h-4 w-4" />
                {t('classrooms.viewDialog.notificationSettings')}
              </span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <Bell className="text-muted-foreground h-4 w-4" />
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      {t('classrooms.viewDialog.sendNotifications')}
                    </label>
                    <p className="text-sm">
                      {classroom.sendNotifications
                        ? t('common.yes')
                        : t('common.no')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="text-muted-foreground h-4 w-4" />
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      {t('classrooms.viewDialog.attendanceThreshold')}
                    </label>
                    <p className="text-sm">
                      {classroom.attendanceThreshold
                        ? classroom.attendanceThreshold
                        : '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      {t('classrooms.viewDialog.reminderFrequency')}
                    </label>
                    <p className="text-sm">
                      {classroom.reminderFrequency
                        ? classroom.reminderFrequency
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-base font-semibold">
                <BookOpen className="h-4 w-4" />
                {t('classrooms.viewDialog.modules')}
              </span>
              <div className="flex flex-wrap gap-4">
                {classroom.modules.map((classroomModule) => {
                  const module = classroomModule.module;
                  return (
                    <Badge
                      key={module.id}
                      variant="outline"
                      className="text-muted-foreground p-1 text-sm"
                    >
                      {t(`moduleNames.${module.code as ModuleCode}`)}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrations Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {t('classrooms.details.integrations.title')}
            </CardTitle>
            <CardDescription>
              {t('classrooms.details.integrations.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {classroom.integrations && classroom.integrations.length > 0 ? (
              <div className="space-y-4">
                {classroom.integrations.map((integration, index) => (
                  <Card
                    key={integration.id}
                    className="border-l-4 border-l-blue-500"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MapPin className="h-4 w-4" />
                        {t('classrooms.details.integrations.integrationTitle', {
                          number: index + 1,
                        })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-3">
                          <BookOpen className="text-muted-foreground h-4 w-4" />
                          <div>
                            <label className="text-muted-foreground text-sm font-medium">
                              {t(
                                'classrooms.actionDialog.integrations.subject'
                              )}
                            </label>
                            <p className="text-sm">
                              {integration.subject?.name || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <BookOpen className="text-muted-foreground h-4 w-4" />
                          <div>
                            <label className="text-muted-foreground text-sm font-medium">
                              {t(
                                'classrooms.actionDialog.integrations.curriculum'
                              )}
                            </label>
                            <p className="text-sm">
                              {integration.curriculum?.name || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <User className="text-muted-foreground h-4 w-4" />
                          <div>
                            <label className="text-muted-foreground text-sm font-medium">
                              {t(
                                'classrooms.actionDialog.integrations.teacher'
                              )}
                            </label>
                            <p className="text-sm">
                              {integration.teacher
                                ? `${integration.teacher.firstName} ${integration.teacher.lastName}`
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      {integration.schedules &&
                        integration.schedules.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                              <Calendar className="h-4 w-4" />
                              {t('classrooms.details.integrations.schedules')}
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {integration.schedules.map(
                                (schedule, scheduleIndex) => (
                                  <Badge
                                    key={scheduleIndex}
                                    variant="outline"
                                    className="flex items-center gap-1"
                                  >
                                    <Calendar className="h-3 w-3" />
                                    {t(`days.${schedule.dayOfWeek}`)} -{' '}
                                    {dayjs(schedule.startTime).format('HH:mm')}{' '}
                                    to {dayjs(schedule.endTime).format('HH:mm')}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-center">
                <BookOpen className="text-muted-foreground/50 h-8 w-8" />
                <p>{t('classrooms.details.integrations.noIntegrations')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  );
}
