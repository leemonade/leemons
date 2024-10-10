type ProgramBarSelectorProps = {
  onChange?: (program: string) => void;
  isAdmin?: boolean;
  children?: React.ReactNode;
  clear?: () => void;
  hideIcon?: boolean;

  chevronSize?: number;
  itemSelectedFontSize?: number;
  itemSelectedFontWeight?: number;
};

export function ProgramBarSelector(props: ProgramBarSelectorProps);
