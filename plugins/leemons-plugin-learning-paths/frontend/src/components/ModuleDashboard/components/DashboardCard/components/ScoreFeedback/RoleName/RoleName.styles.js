import { createStyles } from '@bubbles-ui/components';

const useRoleNameStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    height: theme.spacing[4],
  },
  icon: {
    position: 'relative',
    width: theme.spacing[4],
    height: theme.spacing[4],
    color: theme.other.global.content.color.text.default,
  },
  text: {
    color: theme.other.cardEvaluation.content.color.muted,
    ...theme.other.cardEvaluation.content.typo.sm,
  },
}));

export default useRoleNameStyles;
export { useRoleNameStyles };
