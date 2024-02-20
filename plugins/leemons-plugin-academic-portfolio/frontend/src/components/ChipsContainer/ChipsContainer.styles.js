import { createStyles } from '@bubbles-ui/components';

const ChipsContainerStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreChip: {
    color: theme.other.button.content.color.secondary.default,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
    textDecoration: 'underline',
    paddingLeft: 12,
  },
  dropdown: {
    '&.mantine-HoverCard-dropdown': {
      backgroundColor: theme.other.tooltip.background.color.default,
    },
    width: 'max-content',
    display: 'flex',
    flexDirection: 'column',
  },
  labelTooltip: {
    ...theme.other.tooltip.content.typo,
    color: theme.other.tooltip.background.color['default-reverse'],
  },
}));

export { ChipsContainerStyles };
