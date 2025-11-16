import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useSubjectDetailsContext } from '../SubjectDetailsContext';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { trpc } from '@/lib/trpc';

export function SubjectTeachers() {
  const { t } = useTranslation();
  const { subject } = useSubjectDetailsContext();

  const teachers = subject?.teachers.map((teacher) => teacher.teacher) ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('subjects.details.tabs.teachers')}</CardTitle>
          <CardDescription>
            {t('subjects.details.teachersDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <div className="text-muted-foreground flex h-32 items-center justify-center">
              {t('subjects.details.noTeachers')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.name')}</TableHead>
                  <TableHead>{t('common.email')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      {teacher.firstName} {teacher.lastName}
                    </TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          teacher.status === 'ACTIVE'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {teacher.status === 'ACTIVE'
                          ? t('common.active')
                          : t('common.inactive')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
