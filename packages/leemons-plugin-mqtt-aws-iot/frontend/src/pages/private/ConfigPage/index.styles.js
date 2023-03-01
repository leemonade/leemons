import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const ConfigPageStyles = createStyles((theme) => ({
  subTitle: {
    ...theme.other.global.content.typo.heading.sm,
    color: theme.other.global.content.color.text.muted,
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[4],
  },
  saveContainer: {
    borderTop: `1px solid ${theme.other.global.border.color.line.muted}`,
    marginLeft: -theme.spacing[5],
    marginRight: -theme.spacing[5],
    paddingLeft: theme.spacing[5],
    paddingRight: theme.spacing[5],
    paddingTop: theme.spacing[5],
    display: 'flex',
    justifyContent: 'end',
  },
}));
