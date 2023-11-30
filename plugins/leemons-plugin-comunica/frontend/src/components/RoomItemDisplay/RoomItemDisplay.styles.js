import { createStyles, pxToRem } from '@bubbles-ui/components';

export const RoomItemDisplayStyles = createStyles((theme) => ({
  comunica: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    gap: pxToRem(8),
  },
  comunicaText: {
    ...theme.other.cardLibrary.content.typo.sm,
    color: theme.other.cardLibrary.content.color.muted,
  },
}));

export default RoomItemDisplayStyles;
