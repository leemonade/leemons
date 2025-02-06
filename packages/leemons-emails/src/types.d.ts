import type {ReactElement, ReactNode} from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LeemonsEmailsMixin(): any;

export interface EmailTypes {
  active: 'active';
}

export function getEmailTypes(): EmailTypes;


interface EmailLayoutProps {
  locale: string;
  previewText: string;
  title: string;
  logoUrl: string;
  logoWidth: string;
  platformName: string;
  children: ReactNode
}
export function EmailLayout(props: EmailLayoutProps): ReactElement
