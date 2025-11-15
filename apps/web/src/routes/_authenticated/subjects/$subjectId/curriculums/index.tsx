import { SubjectCurriculums } from '@/features/subjects/subject-details/curriculums/root/SubjectCurriculums';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/curriculums/'
)({
  component: SubjectCurriculums,
});
