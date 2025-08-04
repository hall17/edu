import { useQuestionBankContext } from '../QuestionBankContext';

import { QuestionBankActionDialog } from './dialogs/QuestionBankActionDialog';
import { QuestionBankDeleteDialog } from './dialogs/QuestionBankDeleteDialog';
import { QuestionBankViewDialog } from './dialogs/QuestionBankViewDialog';

export function QuestionBankDialogs() {
  const { openedDialog } = useQuestionBankContext();

  function getActiveDialog() {
    switch (openedDialog) {
      case 'add':
      case 'edit':
        return <QuestionBankActionDialog />;
      case 'view':
        return <QuestionBankViewDialog />;
      case 'delete':
        return <QuestionBankDeleteDialog />;
    }
  }

  return <>{getActiveDialog()}</>;
}
