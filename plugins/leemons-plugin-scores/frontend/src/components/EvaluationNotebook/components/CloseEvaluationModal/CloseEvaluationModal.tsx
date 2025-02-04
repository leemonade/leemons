import { createPortal } from 'react-dom';

import ModalContent from './components/ModalContent';
import { StudentEvaluationData, TableData } from './types';

import { RetakePickerProvider } from '@scores/stores/retakePickerStore';

interface Props {
  opened: boolean;
  tableData: TableData;
  onCancel: () => void;
  onConfirm: (data: Record<string, StudentEvaluationData>) => void;
}

export function CloseEvaluationModal({ opened, tableData, onCancel, onConfirm }: Props) {
  if (!opened) {
    return null;
  }

  return createPortal(
    <RetakePickerProvider>
      <ModalContent tableData={tableData} onCancel={onCancel} onConfirm={onConfirm} />
    </RetakePickerProvider>,
    document.body
  );
}
