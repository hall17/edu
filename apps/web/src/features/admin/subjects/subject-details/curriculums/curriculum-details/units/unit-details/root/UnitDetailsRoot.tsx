import { BookOpen, Calendar, Clock, FileText, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSubjectDetailsContext } from '@/features/admin/subjects/subject-details/SubjectDetailsContext';

export function UnitDetailsRoot() {
  const { t } = useTranslation();
  const { unit, curriculum } = useSubjectDetailsContext();

  if (!unit) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 overflow-y-auto">
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {t('subjects.units.viewDialog.basicInfo')}
          </CardTitle>
          <CardDescription>
            {t('subjects.units.viewDialog.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Name */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                {t('common.name')}
              </p>
              <p className="text-sm">{unit.name}</p>
            </div>

            {/* Order */}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                {t('common.order')}
              </p>
              <p className="text-sm">{unit.order}</p>
            </div>

            {/* Curriculum */}
            {curriculum && (
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  {t('common.curriculum')}
                </p>
                <p className="text-sm">{curriculum.name}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {unit.description && (
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                {t('common.description')}
              </p>
              <p className="text-sm">{unit.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('subjects.units.statistics.title')}
          </CardTitle>
          <CardDescription>
            {t('subjects.units.statistics.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Total Lessons */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="text-muted-foreground h-4 w-4" />
                <p className="text-muted-foreground text-sm font-medium">
                  {t('subjects.units.statistics.totalLessons')}
                </p>
              </div>
              <p className="text-2xl font-bold">{unit.lessons?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timestamps Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('common.timestamps')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <p className="text-muted-foreground text-sm font-medium">
                  {t('common.createdAt')}
                </p>
              </div>
              <p className="text-sm">
                {new Date(unit.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <p className="text-muted-foreground text-sm font-medium">
                  {t('common.updatedAt')}
                </p>
              </div>
              <p className="text-sm">
                {new Date(unit.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
