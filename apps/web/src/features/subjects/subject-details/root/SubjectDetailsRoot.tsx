import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Settings,
  Users,
  Target,
  FileText,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useSubjectDetailsContext } from '../SubjectDetailsContext';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SubjectDetailsRoot() {
  const { t } = useTranslation();
  const { subject } = useSubjectDetailsContext();

  if (!subject) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 overflow-y-auto">
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {t('subjects.viewDialog.basicInfo')}
          </CardTitle>
          <CardDescription>
            {t('subjects.viewDialog.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Name */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                {t('common.name')}
              </p>
              <p className="text-sm">{subject.name}</p>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                {t('common.status')}
              </p>
              <Badge
                variant={
                  subject.status === 'ACTIVE' ? 'success' : 'destructive'
                }
                className="w-fit"
              >
                {subject.status === 'ACTIVE'
                  ? t('common.active')
                  : t('common.inactive')}
              </Badge>
            </div>

            {/* Branch */}
            {subject.branch && (
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Branch
                </p>
                <p className="text-sm">{subject.branch.name}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {subject.description && (
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                {t('common.description')}
              </p>
              <p className="text-sm">{subject.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('subjects.details.statistics')}
          </CardTitle>
          <CardDescription>
            {t('subjects.details.statisticsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Total Curriculums */}
            <div className="flex flex-col items-center justify-center rounded-lg border p-4">
              <FileText className="text-muted-foreground mb-2 h-8 w-8" />
              <p className="text-2xl font-bold">
                {subject._count?.curriculums || 0}
              </p>
              <p className="text-muted-foreground text-sm">
                {t('subjects.details.totalCurriculums')}
              </p>
            </div>

            {/* Total Teachers */}
            <div className="flex flex-col items-center justify-center rounded-lg border p-4">
              <Users className="text-muted-foreground mb-2 h-8 w-8" />
              <p className="text-2xl font-bold">
                {subject._count?.teachers || 0}
              </p>
              <p className="text-muted-foreground text-sm">
                {t('subjects.details.totalTeachers')}
              </p>
            </div>

            {/* Total Questions */}
            <div className="flex flex-col items-center justify-center rounded-lg border p-4">
              <FileText className="text-muted-foreground mb-2 h-8 w-8" />
              <p className="text-2xl font-bold">
                {subject._count?.questions || 0}
              </p>
              <p className="text-muted-foreground text-sm">
                {t('subjects.details.totalQuestions')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timestamps Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timestamps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Created At */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                {t('common.createdAt')}
              </p>
              <p className="text-sm">
                {new Date(subject.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Updated At */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                {t('common.updatedAt')}
              </p>
              <p className="text-sm">
                {new Date(subject.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
