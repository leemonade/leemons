interface EmailLayoutProps {
  locale?: string;
  title?: string;
  previewText?: string;
  logoUrl?: string;
  logoWidth?: string;
  platformName?: string;
  children: ReactNode
}
export function EmailLayout(props: EmailLayoutProps): ReactElement
