import { BookOpen, Calendar, Clock, FileText, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useSubjectDetailsContext } from '../../../SubjectDetailsContext';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function CurriculumDetailsRoot() {
  const { t } = useTranslation();
  const { curriculum, subject } = useSubjectDetailsContext();

  if (!curriculum) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 overflow-y-auto">
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {t('subjects.curriculums.viewDialog.basicInfo')}
          </CardTitle>
          <CardDescription>
            {t('subjects.curriculums.viewDialog.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Name */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                {t('common.name')}
              </p>
              <p className="text-sm">{curriculum.name}</p>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                {t('common.status')}
              </p>
              <Badge
                variant={
                  curriculum.status === 'ACTIVE' ? 'success' : 'destructive'
                }
                className="w-fit"
              >
                {curriculum.status === 'ACTIVE'
                  ? t('common.active')
                  : t('common.inactive')}
              </Badge>
            </div>

            {/* Subject */}
            {subject && (
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  {t('common.subject')}
                </p>
                <p className="text-sm">{subject.name}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {curriculum.description && (
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                {t('common.description')}
              </p>
              <p className="text-sm">{curriculum.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('subjects.curriculums.details.statistics')}
          </CardTitle>
          <CardDescription>
            {t('subjects.curriculums.details.statisticsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Total Units */}
            <div className="flex flex-col items-center justify-center rounded-lg border p-4">
              <BookOpen className="text-muted-foreground mb-2 h-8 w-8" />
              <p className="text-2xl font-bold">
                {curriculum._count?.units || 0}
              </p>
              <p className="text-muted-foreground text-sm">
                {t('subjects.curriculums.details.totalUnits')}
              </p>
            </div>

            {/* Total Units */}
            <div className="flex flex-col items-center justify-center rounded-lg border p-4">
              <Calendar className="text-muted-foreground mb-2 h-8 w-8" />
              <p className="text-2xl font-bold">
                {curriculum.units.length || 0}
              </p>
              <p className="text-muted-foreground text-sm">
                {t('subjects.curriculums.details.totalLessons')}
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
                {new Date(curriculum.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Updated At */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                {t('common.updatedAt')}
              </p>
              <p className="text-sm">
                {new Date(curriculum.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
