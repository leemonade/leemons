import { createStyles } from '@bubbles-ui/components';

const useSubjectItemListStyles = createStyles((theme, { itemWidth }) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  subjectWrapper: {
    width: itemWidth,
    flex: '0 0 auto',
    '& > div': {
      width: '100%',
      '& > div': {
        width: '100%',
        minWidth: 'unset',
      },
    },
  },
  moreChip: {
    cursor: 'default',
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

export { useSubjectItemListStyles };
export default useSubjectItemListStyles;
