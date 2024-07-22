import { createStyles } from '@bubbles-ui/components';

const useCopyrightTextStyles = createStyles((theme, { reverseColors }) => ({
  text: {
    ...theme.other.cardLibrary.content.typo.sm,
    lineHeight: '20px',
    color: theme.other.button.content.color.primary[reverseColors ? 'default--reverse' : 'default'],
  },
  link: {
    ...theme.other.cardAssignments.content.typo.sm,
    color: `${
      theme.other.button.content.color.primary[reverseColors ? 'default--reverse' : 'default']
    } !important`,
    '&:hover': {
      background: theme.other.button.background.color.ghost.hover,
      color: `${theme.other.button.content.color.secondary.default} !important`,
    },
  },
}));

export default useCopyrightTextStyles;
