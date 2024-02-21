import { createStyles } from '@bubbles-ui/components';

const ChipStyles = createStyles((theme, { isCollisionDetected }) => ({
  root: {
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    border: isCollisionDetected
      ? `1px solid ${theme.other.core.color.danger['500']}`
      : `1px solid ${theme.other.chip.border.color.default}`,
    backgroundColor: isCollisionDetected
      ? theme.other.core.color.white
      : theme.other.chip.background.color.default,
    marginLeft: 8,
  },
  label: {
    ...theme.other.chip.content.typo.sm,
    color: isCollisionDetected
      ? theme.other.core.color.danger['500']
      : theme.other.chip.content.color.default,
  },
}));

export { ChipStyles };
