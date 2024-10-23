import { ReactNode } from "react";

export interface FormWithLayoutProps {
  assignable: object;
  children?: ReactNode;

  onPrevStep?: () => void;
  onNextStep?: () => void;
  hasPrevStep?: boolean;
  hasNextStep?: boolean;
  assignable: object;
  loading?: boolean;
  localizations: object;
  evaluationType?: 'manual' | 'auto' | 'none';
  evaluationTypes?: ('manual' | 'auto' | 'none')[];
  hideMaxTime?: boolean;
  hideSectionHeaders?: boolean;
  onlyOneSubject?: boolean;
  onSubmit?: (data: object) => void;
  showTitle?: boolean;
  showThumbnail?: boolean;
  showEvaluation?: boolean;
  showInstructions?: boolean;
  showMessageForStudents?: boolean;
  showReport?: boolean;
  showResponses?: boolean;
  hideShowInCalendar?: boolean;
  scrollRef?: React.RefObject<HTMLDivElement>;
  defaultValues?: object;
}

export function FormWithLayout(props: FormWithLayoutProps): ReactNode;
