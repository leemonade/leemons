import { createStyles } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export const RoomInstanceViewStyles = createStyles((theme) => ({
  view: {
    ...theme.other.button.content.typo,
    color: theme.other.link.content.color.default,
    cursor: 'pointer',
  },
}));
