import { useTranslation } from 'react-i18next';

import { useAssessmentsContext } from '../AssessmentsContext';

import { Badge } from '@/components/ui/badge';

export function AssessmentsDataTableToolbar() {
  const { t } = useTranslation();
  const { assessmentsQuery, filters, resetFilters } = useAssessmentsContext();

  return null;
  // <CustomDataTableToolbar
  //   filterKey="status"
  //   filters={filters}
  //   resetFilters={resetFilters}
  //   searchPlaceholder={t('assessments.searchPlaceholder')}
  //   searchKey="q"
  // >
  //   <div className="flex items-center gap-2">
  //     {assessmentsQuery.data?.count ? (
  //       <Badge variant="secondary">
  //         {t('common.totalCount', { count: assessmentsQuery.data.count })}
  //       </Badge>
  //     ) : null}
  //   </div>
  // </CustomDataTableToolbar>
  // );
}
