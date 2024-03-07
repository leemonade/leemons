import { createStyles } from '@bubbles-ui/components';

const ButtonIconStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    width: '40px',
    maxHeight: '40px',
    padding: '12px 16px 8px 16px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
    backgroundColor: theme.other.buttonIconCard.background.color.primary.default,
    '&:hover': {
      backgroundColor: theme.other.buttonIconCard.background.color.primary.hover,
    },
  },
}));

export { ButtonIconStyles };
