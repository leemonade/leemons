import { createStyles } from '@bubbles-ui/components';

const ChipStyles = createStyles((theme) => ({
  root: {
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    border: `1px solid ${theme.other.chip.border.color.default}`,
    backgroundColor: theme.other.chip.background.color.default,
    marginLeft: 8,
  },
  label: {
    ...theme.other.chip.content.typo.sm,
    color: theme.other.chip.content.color.default,
  },
}));

export { ChipStyles };
