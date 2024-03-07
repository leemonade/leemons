import { createStyles } from '@bubbles-ui/components';

export const useLinkSubmissionStyles = createStyles((theme) => ({
  linkSubmission: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.other.global.spacing.padding.md,
    width: 436,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.other.global.border.color.line.muted,
    borderStyle: 'solid',
    padding: theme.other.global.spacing.padding.md,
    cursor: 'pointer',
  },
  linkSubmissionText: {
    textDecoration: 'underline',
  },
}));

export default useLinkSubmissionStyles;
